import test from'node:test';import assert from'node:assert/strict';import{convert,drawingToReal,findScale,realToDrawing,rescale}from'../../src/js/math/scale.js';
test('convierte unidades lineales',()=>{assert.equal(convert(2.5,'m','cm'),250);assert.equal(convert(1,'in','mm'),25.4);});
test('pasa del plano a la realidad',()=>{const r=drawingToReal({drawingLength:8,drawingUnit:'cm',ratio:50,outputUnit:'m'});assert.equal(r.result,4);});
test('pasa de la realidad al plano',()=>{const r=realToDrawing({realLength:5,realUnit:'m',ratio:100,outputUnit:'cm'});assert.equal(r.result,5);});
test('descubre la escala con unidades diferentes',()=>{const r=findScale({drawingLength:5,drawingUnit:'cm',realLength:5,realUnit:'m'});assert.equal(r.ratio,100);assert.equal(r.nearest,100);assert.equal(r.errorPercent,0);});
test('informa la escala estándar más cercana',()=>{const r=findScale({drawingLength:4.9,drawingUnit:'cm',realLength:5,realUnit:'m'});assert.equal(r.nearest,100);assert.ok(r.errorPercent<3);});
test('calcula porcentaje para cambiar escala',()=>{const r=rescale({currentRatio:100,targetRatio:50,measuredLength:8});assert.equal(r.percent,200);assert.equal(r.newLength,16);});
test('reduce correctamente de 1:50 a 1:100',()=>{const r=rescale({currentRatio:50,targetRatio:100,measuredLength:12});assert.equal(r.percent,50);assert.equal(r.newLength,6);});
