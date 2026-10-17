"""Regression checks for the website ZIP publishing gate."""
import hashlib
import importlib.util
import io
from pathlib import Path
import tempfile
import unittest
import zipfile

spec = importlib.util.spec_from_file_location("check_site", Path(__file__).resolve().parents[1] / "scripts/check_site.py")
site = importlib.util.module_from_spec(spec)
spec.loader.exec_module(site)


def zipped(entries):
    output = io.BytesIO()
    with zipfile.ZipFile(output, "w") as archive:
        for name, payload in entries:
            archive.writestr(name, payload)
    return output.getvalue()


class AndroidPackageTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.file = "WhiplashMaster-v2.2.0-KMM-release.apk"
        self.apk = zipped([("AndroidManifest.xml", b"manifest"), ("classes.dex", b"dex")])

    def check(self, payload, filename=None, apk=None):
        name = filename or self.file + ".zip"
        path = Path(self.directory.name) / name
        path.write_bytes(payload)
        android = {
            "version": "v2.2.0", "file": name, "path": "downloads/" + name,
            "size": len(payload), "sha256": hashlib.sha256(payload).hexdigest(),
            "apk": {"file": self.file, "size": len(self.apk),
                    "sha256": hashlib.sha256(self.apk).hexdigest()},
        }
        if apk:
            android["apk"].update(apk)
        return site.check_android_package(path, android)

    def test_supplied_macos_zip_is_supported(self):
        self.assertEqual([], self.check(zipped([(self.file, self.apk), ("__MACOSX/._" + self.file, b"metadata")])))

    def test_direct_apk_is_rejected(self):
        self.assertTrue(self.check(self.apk, self.file))

    def test_apk_renamed_zip_is_rejected(self):
        self.assertTrue(self.check(self.apk))

    def test_wrong_version_and_multiple_apks_are_rejected(self):
        for entries in [[("old.apk", self.apk)], [(self.file, self.apk), ("extra.apk", self.apk)]]:
            with self.subTest(entries=[name for name, _ in entries]):
                self.assertTrue(self.check(zipped(entries)))

    def test_changed_inner_apk_is_rejected_even_with_correct_outer_hash(self):
        self.assertTrue(self.check(zipped([(self.file, self.apk)]), apk={"sha256": "0" * 64}))

    def test_corrupt_zip_is_rejected(self):
        self.assertTrue(self.check(b"broken ZIP"))


if __name__ == "__main__":
    unittest.main()
