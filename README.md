[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/JuliaLind/jsramverk/badges/quality-score.png?b=main)](https://scrutinizer-ci.com/g/JuliaLind/jsramverk/?branch=main)

# Diverse instruktioner

Efter att ha klonat repot behöver du köra ```npm install``` från roten av frontend- respektive backend-katalogen för att installera nödvändiga dependencies. Du behöver även lägga till följande filer:  

1. I backend-katalogen skapar du en ".env" fil i vilken du lägger till följande variabler:

- TRAFIKVERKET_API_KEY (api nyckel som du genererar från trafikverkets webbplats)
- DSN (connection strängen till din databas, du kan använde lokal eller molnbaserad.)
- URL (url till front-end servern, t ex ```URL="https://www.student.bth.se"```).

I MongoDB behöver du skapa databaserna "trains" respektive "test". I respektive databas kommer du behöva två collections "tickets" respektive "users". I users-collection behöver du lägga till en unique constraint på 'email' fältet. Enklast gör du det via MongoDBCompass-appen.

2. I frontend-katalogen lägger du till en ".env.development" fil med variabeln VITE_URL som innehåller url till backend-servern lokalt (t.ex. ```VITE_URL="http://localhost:1337"```).

3. I frontend-katalogen lägger du även till en ".env.production" fil med motsvarande variabel för url till den backend-server som ska användas i produktion, t ex ```VITE_URL="https://jsramverk-marjul2023.azurewebsites.net"```. Env-variabler som används i frontend måste börja på VITE_".

I package.json filerna i roten av frontend respektive backend hittar du färdiga scripts som kan köras för att starta igång applikationen, testa mm. För att få igång applikationen lokalt behöver du tex först sätta igång backend genom att skriva ```npm run dev``` i terminalen när du står i roten av backend-katalogen, och därefter göra motsvarande från roten av frontend-katalogen (obs i ett annat terminalfönster).

Du kommer då åt frontend-applikationen via http://localhost:5173 .  
Du kan, direkt i webbläsaren, göra förfrågningar mot api-endpointen http://localhost:1337/graphql . För att det ska fungera, måste du i app.js (i backend-katalogen) sätta visual-variabelns värde till ```true```. Ändra tillbaka till false i produktion.

När du kör scripten för testning kan du eventuellt behöva komplettera med installation av fler dependecies med npx. För testning i backend används Mocka/Chai tillsammans med Istanbul. I frontend används Playwrite för e2e testning och Vitest för testning av komponenter, också tillsammans med Istanbul.


4. Länkar till våra applikationer:

- Frontend-applikationen --> https://www.student.bth.se/~juli22/jsramverk/
- Backend-applikationen --> https://jsramverk-marjul2023.azurewebsites.net

5. Vi använder GitHub Actions för att automatisera ett antal arbetsflöden vid push och pull requests mot vårt GitHub-repo. Dessa flöden är tänkta att underlätta utvecklingsprocessen för oss samt säkerställa att den kod vi vill merge:a är stabil. Följande flöden för vårt repo:

* Backend: flödet kör tester.
* Frontend-vitest: flödet kör vitest-tester.
* Frontend-playwright: flödet kör playwright-tester.
* Linters: flödet kör repots alla linters.


# Steg vi fick gå igenom för att få applikationen att fungera  

För att få appen att fungera behövde vi:  

1. ställa oss i "backend" katalogen och köra ```npm install``` för att installera alla dependencies i package.json och därefter ```npm audit --fix``` för att laga säkerhetshålen (vulnerabilities)
2. uppdatera i sökvägarna i reset_db.bash filen från db/ till ./ och därefter köra filen med kommandot: bash reset_db.bash för att skapa en tom tickets-tabell i databasen
3. registrera oss på https://api.trafikinfo.trafikverket.se/Account/Register för att få en API nyckel
4. lägga till en .env fil i roten av "backend" mappen där vi lade till API nyckeln så att den sedan kan hämtas in via process.env
5. det saknades också en del semikolon här och var i filerna som vi lade till, exempelvis i app.js på raderna 1-8, 13, 31, 44
6. "avkommentera" ```// fetchTrainPositions(io);``` längst ner i app.js filen för att hämta in tågpositions-datan relaterad för visning av markers på kartan
7. ladda ner en favicon, placera den i frontend-mappen och lägg till en ``` link ```-tag i index.html som länkar till den sparade faviconen.

# Val av frontend-ramverk

Vi har valt Vue som vårt frontend-ramverk. Vi valde Vue som ramverk för att vi redan har kodat enligt React-sättet i webapp-kursen. Vi vill testa ett nytt sätt att koda på.  

När vi skapade frontend-ramverket med ``` npm create vue@latest ``` gjorde vi följande val:  

✔ Project name: … vue-project  
✔ Add TypeScript? … No  
✔ Add JSX Support? … Yes  
✔ Add Vue Router for Single Page Application development? … Yes  
✔ Add Pinia for state management? … Yes  
✔ Add Vitest for Unit Testing? … Yes  
✔ Add an End-to-End Testing Solution? › Playwright  
✔ Add ESLint for code quality? … Yes  
✔ Add Prettier for code formatting? … Yes  

När vi skulle välja en lösning för testning end-to-end, stod valet mellan Playwright och Cypress. Vi valde Playwright för att verktyget hade näst flest användare, men flest stjärnor på GitHub. Vi drog därmed slutsatsen att en större andel användare är nöjda med Playwright.

# Säkerhetshål  

Vi hittade följande 11 säkerhetshål som samtliga kunde åtgärdas med kommandot ```npm audit fix``` :


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