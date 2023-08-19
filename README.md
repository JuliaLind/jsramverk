# Diverse instruktioner

För att starta upp appen sätt igång backend-delen genom att stå i "backend" mappen och skriv följande i terminalen: ```node app.js``` .
samt frontend genom att ställa dig i "frontend" mappen och skiva följande i terminalen: ```python3 -m http.server 9000```.

Du kommer då åt frontend applikationen via http://localhost:9000 . Via sidorna http://localhost:1337/delayed , http://localhost:1337/tickets eller http://localhost:1337/codes kan du se underliggande datan som json objekt


# Steg vi fick gå igenom för att få applikationen att fungera  

För att få appen att fungera behövde vi:  

1. ställa oss i "backend" katalogen och köra "npm install" för att installera alla dependencies i packade.json
2. uppdatera i sökvägarna i reset_db.bash filen från db/ till ./ och därefter köra filen med kommandot: bash reset_db.bash för att skapa en tom tickets-tabell i databasen
3. registrera oss på https://api.trafikinfo.trafikverket.se/Account/Register för att få en API nyckel
4. lägga till en .env fil i roten av "backend" mappen där vi lade till API nyckeln så att den sedan kan hämtas in via process.env
5. det saknades också en del semikolon här och var i filerna som vi lade till, exempelvis i app.js på raderna 1-8, 13, 31, 44
6. "avkommentera" ```// fetchTrainPositions(io);``` längst ner i app.js filen för att hämta in tågpositions-datan relaterad för visning av markers på kartan


# Säkerhetshål  

Vi hittade följande 11 säkerhetshål som samtliga kunde åtgärdas med kommandot ```npm audit fix`` :


## npm audit report

debug  <=2.6.8
Severity: high
debug Inefficient Regular Expression Complexity vulnerability - https://github.com/advisories/GHSA-9vvw-cc9w-f27h
Regular Expression Denial of Service in debug - https://github.com/advisories/GHSA-gxpj-cx7g-858c
Depends on vulnerable versions of ms
fix available via `npm audit fix`
node_modules/debug
  express  2.5.8 - 4.15.4 || 5.0.0-alpha.1 - 5.0.0-alpha.5
  Depends on vulnerable versions of debug
  Depends on vulnerable versions of finalhandler
  Depends on vulnerable versions of fresh
  Depends on vulnerable versions of qs
  Depends on vulnerable versions of send
  Depends on vulnerable versions of serve-static
  node_modules/express
  finalhandler  <=1.0.5
  Depends on vulnerable versions of debug
  node_modules/finalhandler
  send  <=0.15.6
  Depends on vulnerable versions of debug
  Depends on vulnerable versions of fresh
  Depends on vulnerable versions of mime
  Depends on vulnerable versions of ms
  node_modules/send
  node_modules/serve-static/node_modules/send
    serve-static  1.1.0 - 1.12.5
    Depends on vulnerable versions of send
    node_modules/serve-static

fresh  <0.5.2
Severity: high
Regular Expression Denial of Service in fresh - https://github.com/advisories/GHSA-9qj9-36jm-prpv
fix available via `npm audit fix`
node_modules/fresh

mime  <1.4.1
Severity: moderate
mime Regular Expression Denial of Service when mime lookup performed on untrusted user input - https://github.com/advisories/GHSA-wrvr-8mpx-r7pp
fix available via `npm audit fix`
node_modules/mime

ms  <2.0.0
Severity: moderate
Vercel ms Inefficient Regular Expression Complexity vulnerability - https://github.com/advisories/GHSA-w9mr-4mfr-499f
fix available via `npm audit fix`
node_modules/ms
node_modules/serve-static/node_modules/ms

node-fetch  <2.6.7
Severity: high
node-fetch is vulnerable to Exposure of Sensitive Information to an Unauthorized Actor - https://github.com/advisories/GHSA-r683-j2x4-v87g
fix available via `npm audit fix`
node_modules/node-fetch

qs  <=6.2.3
Severity: high
Prototype Pollution Protection Bypass in qs - https://github.com/advisories/GHSA-gqgv-6jq5-jjj9
qs vulnerable to Prototype Pollution - https://github.com/advisories/GHSA-hrpp-h998-j3pp
fix available via `npm audit fix`
node_modules/qs

semver  6.0.0 - 6.3.0 || 7.0.0 - 7.5.1
Severity: moderate
semver vulnerable to Regular Expression Denial of Service - https://github.com/advisories/GHSA-c2qf-rxjj-qqgw
semver vulnerable to Regular Expression Denial of Service - https://github.com/advisories/GHSA-c2qf-rxjj-qqgw
fix available via `npm audit fix`
node_modules/make-dir/node_modules/semver
node_modules/semver

11 vulnerabilities (3 moderate, 8 high)

To address all issues, run:
  npm audit fix