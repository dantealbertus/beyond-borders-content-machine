"""
Beyond Borders Protocol — Content Framework
Wordt gebruikt als context voor alle AI-contentgeneratie.
Niche: Bali vastgoed investeren voor Nederlandse ondernemers.
"""

BRAND_CONTEXT = """
Naam: Beyond Borders Protocol
Dienst: Begeleiding bij het investeren in Bali villa's — van oriëntatie tot sleuteloverdracht
        en passief inkomen via verhuur
Doelgroep: Nederlandse ondernemers (35-55 jaar) met opgebouwd vermogen die willen
           diversifiëren buiten Nederland — vaak gefrustreerd door belasting, box 3,
           hoge aanschafprijzen, en de zoektocht naar rendement en vrijheid
Kernboodschap: Investeren in een Bali villa is mogelijk, winstgevend en beheersbaar —
               als je de juiste begeleiding hebt
Tone of voice: Direct, nuchter, informatief — NIET salesy
               Schrijf als een betrouwbare insider die jargon uitlegt zonder neer te kijken
Taal: Nederlands
Schrijf in jij/jou (geen u tenzij specifiek gevraagd)
Gebruik GEEN exclamatiepunten
Gebruik GEEN verkooptaal, generieke marketingtaal, of overdreven beloftes
Vermijd: "uniek kans", "nu of nooit", "droomleven", clichés over Bali als vakantieoord

KERNFEITEN OM TE GEBRUIKEN:
- Gemiddeld bruto verhuurrendement Bali villa's: 12-18% per jaar
- PT PMA is de juridische structuur voor buitenlandse eigendom (foreign-owned company)
- Leasehold (huurrecht 25-30 jaar met verlengingsoptie) is de meest voorkomende eigendomsvorm
- Off-plan villa's zijn 20-30% goedkoper dan opgeleverde villa's
- Seminyak, Canggu, Ubud, Uluwatu zijn populaire investeringsgebieden met verschillende profielen
- Populaire verhuurplatforms: Airbnb, Booking.com, lokale villa managers
- Indonesische belasting op verhuurinkomsten: circa 10% voor buitenlanders
- Gemiddelde bouwkosten villa op Bali: $150.000-$350.000 exclusief grond
- Grondleaseprijs: sterk afhankelijk van locatie — Canggu duurder dan inland Ubud
- Notaris (PPAT) verplicht bij elke grondtransactie in Indonesië
- Beheer op afstand mogelijk via lokale property manager (kosten: 20-30% van omzet)
- Bali heeft geen vermogensbelasting vergelijkbaar met Nederlands box 3 systeem
"""

INSTAGRAM_RULES = """
PLATFORM REGELS INSTAGRAM:
- Reels krijgen 2-3x meer bereik dan statische posts
- Eerste frame van een Reel moet direct de aandacht pakken (geen intro, geen logo)
- Saves en shares zijn waardevoller dan likes — schrijf content die mensen willen bewaren
- Carrousels: maximaal 10 slides met educatieve inhoud, één punt per slide
- Geen externe links in de post zelf — verwijs naar link in bio
- Gebruik getallen en specifieke bedragen — dat maakt content geloofwaardig en deelbaar
"""

LINKEDIN_RULES = """
PLATFORM REGELS LINKEDIN:
- Eerste regel is alles — dit is wat mensen zien voor "zie meer" — maak het onweerstaanbaar
- Geen externe links in de post (doodt het algoritmisch bereik aanzienlijk)
- Gebruik witregel tussen alinea's voor leesbaarheid
- 1.200-1.500 tekens werkt goed voor dit publiek
- Reacties zijn waardevoller dan likes — stel een concrete vraag aan het einde
- Eerste uur na plaatsing bepaalt het bereik — reageer snel op eerste reacties
- LinkedIn-lezers zijn ondernemers: gebruik cijfers, concrete resultaten, eerlijke trade-offs
"""

TWITTER_RULES = """
PLATFORM REGELS TWITTER/X:
- Tweet 1 is alles — de hook bepaalt of mensen de thread lezen
- Threads werken het best met 7-10 tweets inclusief hook tweet
- Elke tweet staat op zichzelf en is ook los te lezen
- Gebruik witruimte en korte zinnen — mobielvriendelijk schrijven
- Geen externe links in de thread, alleen optioneel in de laatste tweet
- Gebruik cijfers, percentages en specifieke bedragen — werkt ook op X
- Spaarzaam emoji — maximaal 1-2 per thread, nooit puur decoratief
- Eerste tweet eindigt met ↓ of een dubbele punt om door te klikken
- Elk tweet maximaal 280 tekens
"""

FORMATS = {
    "instagram_carousel": {
        "label": "Carousel",
        "description": "Educational slide series. Bold hook on slide 1, one point per slide, CTA on slide 10.",
        "instructions": """
Maak een Instagram carrousel over Bali vastgoed investeren met de volgende structuur:

Slide 1 (hook): Een boldstatement, concreet getal, of prikkelende vraag die direct raakt
               aan wat de doelgroep (Nederlandse ondernemer met vermogen) bezighoudt
Slides 2-9: Één punt per slide (korte tekst, scanbaar, gebruik cijfers waar relevant)
Slide 10 (CTA): Samenvatting + actie ("Bewaar dit." of "Stuur door naar iemand die dit overweegt.")

Caption structuur:
[Haak — eerste zin voor "meer weergeven", geeft de kernboodschap direct]
[Uitleg van het onderwerp — 3-5 regels met feiten of inzichten]
[CTA — link in bio / sla op / stuur door]
#hashtag1 #hashtag2 #hashtag3

Gebruik concrete cijfers uit de Bali vastgoedmarkt (rendementen, prijzen, belasting, looptijden).
Schrijf vanuit insider-kennis, niet als verkoper.

Geef de output als JSON:
{
  "slides": [{"nummer": 1, "tekst": "..."}, ...],
  "caption": "...",
  "hashtags": ["#...", "..."]
}
""",
    },
    "instagram_reel": {
        "label": "Reel Script",
        "description": "30-second video script. Hook → Setup → Value → CTA.",
        "instructions": """
Schrijf een Reel script van 30 seconden over Bali vastgoed investeren met deze structuur:

Seconde 0-2:  Hook (concreet getal, tegendraadse uitspraak, of herkenbare frustratie van Nederlandse ondernemer)
Seconde 2-5:  Context (waarom dit relevant is voor iemand die wil investeren buiten Nederland)
Seconde 5-25: Waarde (het echte inzicht, de tip, of het inzicht over PT PMA / off-plan / rendement / locatie)
Seconde 25-30: CTA (volg / reageer / link in bio voor gratis gids)

Schrijf het script zoals gesproken tekst — kort, direct, geen buzzwords.

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
        "label": "Story Series",
        "description": "4-story sequence. Story 1 includes a poll to drive engagement.",
        "instructions": """
Schrijf een Story reeks van 4 Stories over Bali vastgoed investeren:

Story 1: Vraag of herkenningsmoment voor de Nederlandse ondernemer (inclusief een poll-optie)
         Voorbeeld: "Heb jij weleens uitgerekend wat je vermogen in box 3 kost?" [Ja / Nee]
Story 2: Verdieping / jouw perspectief met één concreet feit of inzicht
Story 3: Praktische tip of inzicht (bijv. over PT PMA, off-plan, property manager)
Story 4: CTA (link naar weggever / stuur een DM / bezoek link in bio)

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
        "label": "The Story Post",
        "description": "Personal narrative with a turning point and lesson. Drives comments.",
        "instructions": """
Schrijf een LinkedIn verhaalpost over Bali vastgoed investeren voor Nederlandse ondernemers.
Gebruik deze structuur:

[Hook: onverwacht resultaat of concreet getal — dit is de eerste regel die mensen zien]

[Setting: wanneer/waar dit speelde — bijv. gesprek met klant, site visit in Canggu, call met notaris]

[De uitdaging die je tegenkwam — bijv. juridische structuur, bankieren vanuit Nederland, keuze locatie]

[Wat je probeerde / wat er gebeurde]

[Het keerpunt — het inzicht dat alles veranderde]

[Het resultaat in concrete termen (rendement, huurinkomsten, opleverdatum)]

[De les voor de lezer — toepasbaar voor Nederlandse ondernemer met vermogen]

[Vraag om reactie uit te lokken — specifiek en laagdrempelig]

Gebruik witregels tussen elke alinea. Geen externe links. 1.200-1.500 tekens.
Schrijf vanuit persoonlijke ervaring of die van een klant (geanonimiseerd).

Geef de output als JSON:
{
  "post": "volledige tekst met witregels",
  "eerste_regel": "alleen de hook (wat mensen zien voor 'zie meer')"
}
""",
    },
    "linkedin_contrair": {
        "label": "The Contrarian Take",
        "description": "Challenge a common belief with 3 reasons. Sparks debate and reach.",
        "instructions": """
Schrijf een LinkedIn contraire post over een gangbare misvatting over Bali vastgoed investeren.
Gebruik deze structuur:

[Onpopulaire mening over investeren in Bali, direct en concreet gesteld]

Waarom ik dit zeg:

[Reden 1 — onderbouwd met feit of ervaring]
[Reden 2 — onderbouwd met feit of ervaring]
[Reden 3 — onderbouwd met feit of ervaring]

[Wat je aanbeveelt in plaats daarvan — concreet en actionable]

[Uitnodiging tot discussie: "Ben ik de enige die dit zo ziet?" of vergelijkbaar]

Thema's die werken: "Bali investeren is te risicovol" / "je hebt er miljoenen voor nodig" /
"je kunt als buitenlander geen eigendom hebben" / "huurrendement valt altijd tegen" /
"je kunt het niet op afstand beheren" — pak een misvatting en onderbouw het tegendeel.

Gebruik witregels tussen elke alinea. Geen externe links. 1.200-1.500 tekens.

Geef de output als JSON:
{
  "post": "volledige tekst met witregels",
  "eerste_regel": "alleen de openingszin"
}
""",
    },
    "linkedin_lijst": {
        "label": "The List Post",
        "description": "Numbered insights after a credibility builder. Easy to save and share.",
        "instructions": """
Schrijf een LinkedIn lijstpost over Bali vastgoed investeren voor Nederlandse ondernemers.
Gebruik deze structuur:

[X dingen die ik leerde over [onderwerp] na [geloofwaardigheidsanker — bijv. "50 villa-transacties begeleiden"]:

1. [Punt] — [Korte uitleg met concreet detail]

2. [Punt] — [Korte uitleg met concreet detail]

3. [Punt] — [Korte uitleg met concreet detail]

4. [Punt] — [Korte uitleg met concreet detail]

5. [Punt] — [Korte uitleg met concreet detail]

[Afsluitend inzicht dat de lezer aan het denken zet]

Welke herkent jij het meest?

Onderwerpen die werken: PT PMA-structuur / off-plan risico's / locatiekeuze / property management /
belastingverschil NL vs Indonesië / veelgemaakte fouten bij eerste aankoop.

Gebruik witregels tussen elk punt. Geen externe links. 1.200-1.500 tekens.

Geef de output als JSON:
{
  "post": "volledige tekst met witregels",
  "eerste_regel": "alleen de openingszin"
}
""",
    },
    "linkedin_howto": {
        "label": "The How-To",
        "description": "Step-by-step guide with ↳ details. Actionable and bookmarkable.",
        "instructions": """
Schrijf een LinkedIn hoe-doe-je-het post over Bali vastgoed investeren.
Gebruik deze structuur:

Hoe je [gewenst resultaat — bijv. "een Bali villa koopt als buitenlander"] in [tijdsbestek — bijv. "6 stappen"]:

Stap 1: [Actie — bijv. "Kies je juridische structuur (PT PMA of leasehold)"]
↳ [Waarom dit belangrijk is — met concreet gevolg als je het overslaat]

Stap 2: [Actie]
↳ [Kerndetail — bijv. specifieke kosten, tijdsduur, betrokken partij]

Stap 3: [Actie]
↳ [Veelgemaakte fout om te vermijden]

Stap 4: [Actie]
↳ [Tip uit de praktijk]

Stap 5: [Actie]
↳ [Wat dit oplevert]

[Wat je kunt verwachten als resultaat — in concrete termen (rendement, tijdlijn, kosten)]

[CTA of vraag om reactie]

Gebruik witregels tussen elke stap. Geen externe links. 1.200-1.500 tekens.

Geef de output als JSON:
{
  "post": "volledige tekst met witregels",
  "eerste_regel": "alleen de openingszin"
}
""",
    },
    "twitter_tutorial": {
        "label": "Tutorial Thread",
        "description": "Step-by-step how-to across 7-8 tweets. Hook + promise, then one step per tweet.",
        "instructions": """
Schrijf een Twitter/X tutorial thread over Bali vastgoed investeren voor Nederlandse ondernemers.
Gebruik deze structuur:

Tweet 1: Hook + belofte van waarde, eindig met ↓
Tweets 2-7: Één stap per tweet met concreet detail (bijv. PT PMA, due diligence, notaris, locatiekeuze, property manager, belasting)
Tweet 8: Samenvatting + CTA

Elk tweet maximaal 280 tekens. Schrijf als gesproken tekst — direct en zonder buzzwords.
Gebruik cijfers en specifieke details uit de Bali vastgoedmarkt.

Geef de output als JSON:
{
  "tweets": [
    {"nummer": 1, "tekst": "..."},
    {"nummer": 2, "tekst": "..."}
  ]
}
""",
    },
    "twitter_story": {
        "label": "Story Thread",
        "description": "Narrative thread building tension across 7-8 tweets. Hook, story beats, resolution.",
        "instructions": """
Schrijf een Twitter/X story thread over een ervaring met Bali vastgoed investeren.
Gebruik deze structuur:

Tweet 1: Prikkelende openingszin — onverwachte wending of resultaat, eindig met ↓
Tweets 2-6: Story-beats die spanning opbouwen (situatie → uitdaging → poging → keerpunt)
Tweet 7: Ontknoping en resultaat in concrete termen (rendement, tijdlijn, bedragen)
Tweet 8: De les voor de lezer + vraag om reactie

Elk tweet maximaal 280 tekens. Schrijf vanuit persoonlijke ervaring of die van een klant (geanonimiseerd).

Geef de output als JSON:
{
  "tweets": [
    {"nummer": 1, "tekst": "..."},
    {"nummer": 2, "tekst": "..."}
  ]
}
""",
    },
    "twitter_breakdown": {
        "label": "Breakdown Thread",
        "description": "Analyse a trend or topic in Bali real estate. What it is, why it matters, your take.",
        "instructions": """
Schrijf een Twitter/X breakdown thread die een trend, structuur of concept in de Bali vastgoedmarkt analyseert.
Gebruik deze structuur:

Tweet 1: [Trend/concept] is aan het veranderen. Hier is waarom dat belangrijk is ↓
Tweets 2-6: Analyse-punten (wat het is, hoe het werkt, cijfers en feiten, gevolgen voor investeerders)
Tweet 7: Jouw conclusie of standpunt
Tweet 8: Praktische implicatie voor de Nederlandse ondernemer + CTA

Elk tweet maximaal 280 tekens. Gebruik cijfers en feiten, geen meningen zonder onderbouwing.

Geef de output als JSON:
{
  "tweets": [
    {"nummer": 1, "tekst": "..."},
    {"nummer": 2, "tekst": "..."}
  ]
}
""",
    },
}

HOOK_FORMULAS = {
    "curiosity": {
        "label": "Curiosity Hook",
        "description": "Tease an insight without revealing it — makes people need to read on.",
        "formulas": [
            "I was wrong about [common belief].",
            "The real reason [outcome] happens isn't what you think.",
            "[Impressive result] — and it only took [surprisingly short time].",
            "Nobody talks about [insider knowledge].",
        ],
    },
    "story": {
        "label": "Story Hook",
        "description": "Open with a moment in time — creates immediate context and curiosity.",
        "formulas": [
            "Last week, [unexpected thing] happened.",
            "I almost [big mistake/failure].",
            "3 years ago, I [past state]. Today, [current state].",
            "[Person] told me something I'll never forget.",
        ],
    },
    "value": {
        "label": "Value Hook",
        "description": "Lead with the outcome — readers know exactly what they'll get.",
        "formulas": [
            "How to [desirable outcome] (without [common pain]):",
            "[Number] [things] that [outcome]:",
            "The simplest way to [outcome]:",
            "Stop [common mistake]. Do this instead:",
        ],
    },
    "contrarian": {
        "label": "Contrarian Hook",
        "description": "Challenge a widely-held belief — triggers disagreement and high engagement.",
        "formulas": [
            "Unpopular opinion: [bold statement]",
            "[Common advice] is wrong. Here's why:",
            "I stopped [common practice] and [positive result].",
            "Everyone says [X]. The truth is [Y].",
        ],
    },
    "social_proof": {
        "label": "Social Proof Hook",
        "description": "Open with a result or authority — builds credibility immediately.",
        "formulas": [
            "We [achieved result] in [timeframe]. Here's the full story:",
            "[Number] people asked me about [topic]. Here's my answer:",
            "[Authority figure] taught me [lesson].",
        ],
    },
}
