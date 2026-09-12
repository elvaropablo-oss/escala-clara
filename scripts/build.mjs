import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pages } from '../src/pages/pages.mjs';
import { renderPage } from '../src/templates/site.mjs';
import { site } from '../site.config.mjs';
import { applyAnalyticsConsent } from './analytics-consent.mjs';
import { applyShareableCalculations } from './shareable-calculations.mjs';
import { applyCalculationExplanations } from './calculation-explanations.mjs';
import { applyProjectLibrary } from './project-library.mjs';
const verificationTag='<meta name="google-site-verification" content="EwTiLP4eMZK5K7W9U_5tpM7cvJsn4ZaLvRwKYrmuuV0">';
const shareableForms=['convert-form','find-form','rescale-form'];
const explanations={
'convert-form':{formula:'plano → real: medida real = medida del plano × denominador de escala; real → plano: medida del plano = medida real ÷ denominador',formulaSwitch:{field:'direction',values:{drawing:'medida real = medida del dibujo × denominador de la escala, después de convertir ambas magnitudes a la misma unidad',real:'medida del dibujo = medida real ÷ denominador de la escala, después de convertir ambas magnitudes a la misma unidad'}},fields:[['length','Medida de entrada'],['ratio','Denominador de escala']],note:'Internamente las unidades se convierten a milímetros antes de aplicar la escala y después se convierten a la unidad de salida.'},
'find-form':{formula:'denominador de escala = medida real ÷ medida del dibujo, usando primero la misma unidad para ambas',fields:[['drawingLength','Medida en el dibujo'],['realLength','Medida real']],note:'La escala estándar mostrada es la de la lista incorporada cuya distancia al resultado calculado es menor.'},
'rescale-form':{formula:'factor = escala actual ÷ escala objetivo; porcentaje de impresión = factor × 100; nueva medida = medida actual × factor',fields:[['currentRatio','Escala actual (1:n)'],['targetRatio','Escala objetivo (1:n)'],['measuredLength','Medida actual','cm']],note:'Un porcentaje mayor de 100 % amplía la impresión; uno menor de 100 % la reduce.'}};
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),dist=path.join(root,'dist');await rm(dist,{recursive:true,force:true});await mkdir(path.join(dist,'assets'),{recursive:true});await cp(path.join(root,'src/js'),path.join(dist,'assets'),{recursive:true});await cp(path.join(root,'src/styles/site.css'),path.join(dist,'assets/site.css'));await cp(path.join(root,'src/assets/favicon.svg'),path.join(dist,'assets/favicon.svg'));
for(const page of pages){const destination=page.output?path.join(dist,page.output):page.path?path.join(dist,page.path,'index.html'):path.join(dist,'index.html');await mkdir(path.dirname(destination),{recursive:true});let html=applyAnalyticsConsent(renderPage(page),{measurementId:'G-GJP7T04QGS',storageKey:'ec:v1:analytics-consent'});html=applyShareableCalculations(html,shareableForms);html=applyCalculationExplanations(html,explanations);html=applyProjectLibrary(html,{storageKey:'ec:v1:projects',formIds:shareableForms});if(page.path==='')html=html.replace('<head>',`<head>\n  ${verificationTag}`);await writeFile(destination,html,'utf8');}
const urls=pages.filter(page=>!page.noindex&&page.path!=='404').map(page=>`  <url><loc>${site.origin}${site.basePath}${page.path?`${page.path}/`:''}</loc></url>`).join('\n');await writeFile(path.join(dist,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,'utf8');await writeFile(path.join(dist,'.nojekyll'),'','utf8');console.log(`Built ${pages.length} pages in dist/`);
