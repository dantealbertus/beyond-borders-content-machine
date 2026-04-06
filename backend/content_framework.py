"""
Beyond Borders Protocol — Content Framework
Wordt gebruikt als context voor alle AI-contentgeneratie.
"""

BRAND_CONTEXT = """
Naam: Beyond Borders Protocol
Dienst: Begeleiding bij respectvol ontspullen tijdens grote levensovergangen
        (overlijden, kleiner wonen, döstädning)
Doelgroep: Mensen van 50+ die spullen moeten regelen bij verlies of verhuizing,
           vaak samen met familie
Toon: Warm, rustig, respectvol, professioneel — NIET salesy
Taal: Nederlands
Schrijf in jij/jou (geen u tenzij specifiek gevraagd)
Gebruik GEEN exclamatiepunten
Gebruik GEEN verkooptaal, jargon, of overdreven emotionele taal
Vermijd: clichés als "in deze hectische tijden", generieke marketingtaal,
         beloftes die te groot klinken
"""

INSTAGRAM_RULES = """
PLATFORM REGELS INSTAGRAM:
- Reels krijgen 2x meer bereik dan statische posts
- Eerste frame van een Reel moet direct de aandacht pakken
- Saves en shares zijn waardevoller dan likes
- Carrousels: maximaal 10 slides met educatieve inhoud
- Geen externe links in de post zelf
"""

LINKEDIN_RULES = """
PLATFORM REGELS LINKEDIN:
- Eerste regel is alles — dit is wat mensen zien voor "zie meer"
- Geen externe links in de post (doodt bereik)
- Gebruik witregel tussen alinea's voor leesbaarheid
- 1.200–1.500 tekens werkt goed
- Reacties zijn waardevoller dan likes
- Eerste uur na plaatsing bepaalt het bereik
"""

FORMATS = {
    "instagram_carousel": {
        "label": "Carrousel (educatief)",
        "instructions": """
Maak een Instagram carrousel met de volgende structuur:

Slide 1 (hook): Een boldstatement of prikkelende vraag
Slides 2-9: Één punt per slide (korte tekst, scanbaar)
Slide 10 (CTA): Samenvatting + actie ("Bewaar dit." of "Stuur door aan iemand die dit nodig heeft.")

Caption structuur:
[Haak — eerste zin voor "meer weergeven"]
[Uitleg van het onderwerp — 3-5 regels]
[CTA — link in bio / sla op / stuur door]
#hashtag1 #hashtag2 #hashtag3

Geef de output als JSON:
{
  "slides": [{"nummer": 1, "tekst": "..."}, ...],
  "caption": "...",
  "hashtags": ["#...", "..."]
}
""",
    },
    "instagram_reel": {
        "label": "Reel Script (30 sec)",
        "instructions": """
Schrijf een Reel script van 30 seconden met deze structuur:

Seconde 0-2:  Hook (patroononderbreking of boldclaim)
Seconde 2-5:  Context (waarom dit relevant is)
Seconde 5-25: Waarde (het echte advies / de tip)
Seconde 25-30: CTA (volg / reageer / link in bio)

Geef de output als JSON:
{
  "hook": "...",
  "context": "...",
  "waarde": "...",
  "cta": "...",
  "caption": "volledige caption voor onder de Reel",
  "hashtags": ["#...", "..."]
}
""",
    },
    "instagram_story": {
        "label": "Story Reeks",
        "instructions": """
Schrijf een Story reeks van 4 Stories:

Story 1: Vraag of herkenningsmoment (inclusief een poll-optie)
Story 2: Verdieping / jouw perspectief
Story 3: Tip of inzicht
Story 4: CTA (link naar weggever / stuur bericht)

Geef de output als JSON:
{
  "stories": [
    {"nummer": 1, "tekst": "...", "poll_opties": ["...", "..."]},
    {"nummer": 2, "tekst": "..."},
    {"nummer": 3, "tekst": "..."},
    {"nummer": 4, "tekst": "...", "cta": "..."}
  ]
}
""",
    },
    "linkedin_verhaal": {
        "label": "Verhaalpost",
        "instructions": """
Schrijf een LinkedIn verhaalpost met deze structuur:

[Hook: onverwacht resultaat of inzicht — dit is de eerste regel die mensen zien]

[Setting: wanneer/waar dit speelde]

[De uitdaging die je tegenkwam]

[Wat je probeerde / wat er gebeurde]

[Het keerpunt]

[Het resultaat]

[De les voor de lezer]

[Vraag om reactie uit te lokken]

Gebruik witregels tussen elke alinea. Geen externe links. 1.200-1.500 tekens.

Geef de output als JSON:
{
  "post": "volledige tekst met witregels",
  "eerste_regel": "alleen de hook (wat mensen zien voor 'zie meer')"
}
""",
    },
    "linkedin_contrair": {
        "label": "Contraire Post",
        "instructions": """
Schrijf een LinkedIn contraire post met deze structuur:

[Onpopulaire mening, direct en duidelijk gesteld]

Waarom ik dit zeg:

[Reden 1]
[Reden 2]
[Reden 3]

[Wat je aanbeveelt in plaats daarvan]

[Uitnodiging tot discussie: "Ben ik de enige die dit zo ziet?"]

Gebruik witregels tussen elke alinea. Geen externe links. 1.200-1.500 tekens.

Geef de output als JSON:
{
  "post": "volledige tekst met witregels",
  "eerste_regel": "alleen de openingszin"
}
""",
    },
    "linkedin_lijst": {
        "label": "Lijstpost",
        "instructions": """
Schrijf een LinkedIn lijstpost met deze structuur:

[X dingen die ik leerde over [onderwerp] na [geloofwaardigheidsanker]:]

1. [Punt] — [Korte uitleg]

2. [Punt] — [Korte uitleg]

3. [Punt] — [Korte uitleg]

[Afsluitend inzicht]

Welke herkent jij het meest?

Gebruik witregels tussen elk punt. Geen externe links. 1.200-1.500 tekens.

Geef de output als JSON:
{
  "post": "volledige tekst met witregels",
  "eerste_regel": "alleen de openingszin"
}
""",
    },
    "linkedin_howto": {
        "label": "Hoe-doe-je-het",
        "instructions": """
Schrijf een LinkedIn hoe-doe-je-het post met deze structuur:

Hoe je [gewenst resultaat] in [tijdsbestek]:

Stap 1: [Actie]
↳ [Waarom dit belangrijk is]

Stap 2: [Actie]
↳ [Kerndetail]

Stap 3: [Actie]
↳ [Veelgemaakte fout om te vermijden]

[Wat je kunt verwachten als resultaat]

[CTA of vraag]

Gebruik witregels tussen elke stap. Geen externe links. 1.200-1.500 tekens.

Geef de output als JSON:
{
  "post": "volledige tekst met witregels",
  "eerste_regel": "alleen de openingszin"
}
""",
    },
}

HOOK_FORMULAS = {
    "instagram": [
        "Ik had het al die jaren fout.",
        "Wat mensen niet weten over ontspullen bij overlijden.",
        "Vorige week vertelde een klant me iets wat bleef hangen.",
        "Hoe je begint met ontspullen (zonder meteen keuzes te maken):",
        "Stop met [veelgemaakte fout]. Doe dit in plaats daarvan:",
        "Unpopular opinion: een opgeruimd huis is niet het doel.",
        "Iedereen zegt 'begin met weggooien'. Dat is verkeerd.",
    ],
    "linkedin": [
        "Ik had het mis over [gangbare overtuiging].",
        "Niemand praat hierover bij ontspullen na overlijden.",
        "Vorige week liep een klant mijn kantoor in met een doos vol brieven.",
        "5 dingen die ontspullen bij rouw moeilijker maken dan het hoeft:",
        "Unpopular opinion: een leeg huis is niet het doel van ontspullen.",
        "Iedereen zegt 'begin met weggooien'. Dat is het slechtste advies.",
    ],
}
