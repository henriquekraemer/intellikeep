"""Checks that the backend translations stay complete and in step with services.yaml."""
from __future__ import annotations

import json
from pathlib import Path

import pytest
import yaml

INTEGRATION = Path(__file__).parent.parent / "custom_components" / "intellikeep"
TRANSLATIONS = INTEGRATION / "translations"
LOCALES = sorted(path.stem for path in TRANSLATIONS.glob("*.json"))


def _load(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def _keys(data: dict, prefix: str = "") -> set[str]:
    keys: set[str] = set()
    for key, value in data.items():
        path = f"{prefix}.{key}" if prefix else key
        if isinstance(value, dict):
            keys |= _keys(value, path)
        else:
            keys.add(path)
    return keys


def test_strings_json_matches_english():
    english = _load(TRANSLATIONS / "en.json")
    english.pop("title", None)
    assert _load(INTEGRATION / "strings.json") == english


@pytest.mark.parametrize("locale", [locale for locale in LOCALES if locale != "en"])
def test_locale_has_the_same_keys_as_english(locale):
    assert _keys(_load(TRANSLATIONS / f"{locale}.json")) == _keys(_load(TRANSLATIONS / "en.json"))


def test_brazilian_portuguese_matches_portuguese():
    """Home Assistant loads pt-BR.json for "Português (Brasil)", with no fallback to pt.json."""
    assert _load(TRANSLATIONS / "pt-BR.json") == _load(TRANSLATIONS / "pt.json")


def test_every_action_and_field_is_translated():
    services = yaml.safe_load((INTEGRATION / "services.yaml").read_text(encoding="utf-8"))
    translated = _load(TRANSLATIONS / "en.json")["services"]

    assert set(translated) == set(services)
    for service, schema in services.items():
        fields = (schema or {}).get("fields", {})
        assert set(translated[service].get("fields", {})) == set(fields), service


def test_select_options_are_translated():
    services = yaml.safe_load((INTEGRATION / "services.yaml").read_text(encoding="utf-8"))
    selectors = _load(TRANSLATIONS / "en.json")["selector"]

    for schema in services.values():
        for field in (schema or {}).get("fields", {}).values():
            select = field["selector"].get("select")
            if select is None:
                continue
            key = select["translation_key"]
            assert set(selectors[key]["options"]) == set(select["options"]), key
