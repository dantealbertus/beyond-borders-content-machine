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

FORMATS = {
    "instagram_carousel": {
        "label": "Carrousel (educatief)",
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
        "label": "Reel Script (30 sec)",
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
        "label": "Story Reeks",
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
        "label": "Verhaalpost",
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
        "label": "Contraire Post",
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
        "label": "Lijstpost",
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
        "label": "Hoe-doe-je-het",
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
}

HOOK_FORMULAS = {
    "instagram": [
        "Dit is wat een Bali villa jaarlijks oplevert — en wat niemand je vertelt.",
        "Ik heb uitgerekend wat box 3 Nederlandse ondernemers écht kost.",
        "Vorige week sprak ik een ondernemer die zijn PT PMA verkeerd had opgezet. Dit was het gevolg.",
        "Hoe je als Nederlander een villa op Bali koopt (zonder Indonesisch staatsburger te zijn):",
        "Stop met zoeken naar 'veilig rendement' in Nederland. Doe dit in plaats daarvan:",
        "Unpopular opinion: off-plan kopen op Bali is minder risicovol dan de meeste mensen denken.",
        "Iedereen zegt 'Bali is te riskant'. Hier zijn de cijfers.",
        "Wat kost het écht om een villa te beheren als je in Nederland woont?",
        "12% rendement op Bali. 0,36% op een Nederlandse spaarrekening. Laten we praten.",
        "Drie fouten die ik zie bij elke eerste Bali villa-investering.",
    ],
    "linkedin": [
        "Ik had het mis over investeren buiten Nederland.",
        "Niemand vertelt Nederlandse ondernemers dit over PT PMA op Bali.",
        "Vorige week belde een klant me op. Zijn villa in Canggu bracht vorige maand €4.200 op.",
        "5 dingen die ik leerde na het begeleiden van 50+ Bali villa-transacties:",
        "Unpopular opinion: leasehold op Bali is veiliger dan veel mensen denken.",
        "Iedereen zegt 'investeer niet in het buitenland'. Hier is waarom ik het er niet mee eens ben.",
        "Hoe een Nederlandse ondernemer in 6 stappen eigenaar wordt van een Bali villa:",
        "Box 3. Hoge grondprijzen. Laag rendement. Er is een alternatief.",
        "Wat ik wou dat ik wist voordat ik mijn eerste property deal op Bali begeleidde.",
        "De drie vragen die elke investeerder stelt voordat ze ja zeggen tegen Bali.",
    ],
}
