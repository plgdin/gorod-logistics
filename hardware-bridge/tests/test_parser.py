"""Tests for serial packet buffering, parsing, unit conversion, and stability detection."""

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from src.parser.weight_parser import SerialPacketBuffer, WeightProcessor, parse_weight_packet


class SerialPacketBufferTests(unittest.TestCase):
    def test_handles_partial_and_multiple_packets_with_cr_lf_crlf(self) -> None:
        buf = SerialPacketBuffer()
        self.assertEqual(buf.feed(b"ST,GS,+002"), [])
        self.assertEqual(
            buf.feed(b"4.60 kg\r\nUS,GS,+0100.0 kg\r0050.5 kg\n"),
            ["ST,GS,+0024.60 kg", "US,GS,+0100.0 kg", "0050.5 kg"],
        )


class WeightParserTests(unittest.TestCase):
    def test_parses_device_stable_kg(self) -> None:
        parsed = parse_weight_packet("ST,GS,+1254.20 kg")
        self.assertTrue(parsed.valid)
        self.assertEqual(parsed.weight_kg, 1254.2)
        self.assertEqual(parsed.raw_unit, "kg")
        self.assertTrue(parsed.device_stable)
        self.assertFalse(parsed.overload)

    def test_parses_device_unstable_negative_and_zero(self) -> None:
        neg = parse_weight_packet("US,NT,-0002.4 kg")
        self.assertTrue(neg.valid)
        self.assertEqual(neg.weight_kg, -2.4)
        self.assertFalse(neg.device_stable)

        zero = parse_weight_packet("ST,GS,0.00 kg")
        self.assertTrue(zero.valid)
        self.assertEqual(zero.weight_kg, 0.0)
        self.assertTrue(zero.device_stable)

    def test_converts_grams_and_pounds_to_kilograms(self) -> None:
        grams = parse_weight_packet("ST,GS,24600 g")
        self.assertTrue(grams.valid)
        self.assertEqual(grams.weight_kg, 24.6)
        self.assertEqual(grams.raw_weight, 24600.0)
        self.assertEqual(grams.raw_unit, "g")

        lbs = parse_weight_packet("100 lb")
        self.assertTrue(lbs.valid)
        self.assertAlmostEqual(lbs.weight_kg or 0, 45.3592, places=4)

    def test_detects_overload_and_malformed_packets(self) -> None:
        ov = parse_weight_packet("OL,GS,+9999.99 kg")
        self.assertFalse(ov.valid)
        self.assertTrue(ov.overload)

        bad = parse_weight_packet("??BAD#PKT")
        self.assertFalse(bad.valid)
        self.assertFalse(bad.overload)


class WeightProcessorStabilityTests(unittest.TestCase):
    def test_distinguishes_device_stability_from_software_stability(self) -> None:
        proc = WeightProcessor(window_size=4, tolerance_kg=0.05, min_duration_ms=1000)
        r1 = proc.process_packet("150.20 kg", now_mono=0.0)
        r2 = proc.process_packet("150.22 kg", now_mono=0.4)
        r3 = proc.process_packet("150.21 kg", now_mono=0.8)
        self.assertFalse(r3.stable)
        self.assertEqual(r3.stability_source, "UNSTABLE")

        r4 = proc.process_packet("150.20 kg", now_mono=1.2)
        self.assertTrue(r4.stable)
        self.assertEqual(r4.stability_source, "SOFTWARE")

        r_dev = proc.process_packet("ST,GS,+0024.60 kg", now_mono=1.5)
        self.assertTrue(r_dev.stable)
        self.assertEqual(r_dev.stability_source, "DEVICE")


if __name__ == "__main__":
    unittest.main()

