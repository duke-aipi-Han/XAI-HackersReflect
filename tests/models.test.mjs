import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const code = html.match(/<script id="lab-models">([\s\S]*?)<\/script>/)[1];
const Lab = vm.runInNewContext(`${code}\nLab`);

test('cheap labels produce eight times the reward per dollar', () => {
  const dinner = Lab.pudding({meal:10,soup:0,pudding:0});
  const pudding = Lab.pudding({meal:0,soup:0,pudding:10});
  assert.equal(dinner.miles,1000);
  assert.equal(pudding.miles,1000);
  assert.equal(dinner.cost,2000);
  assert.equal(pudding.cost,250);
  assert.equal(pudding.efficiency/dinner.efficiency,8);
});

test('goal, full budget, mixed basket and spending patch use exact cents', () => {
  const goal = Lab.pudding({meal:0,soup:0,pudding:100});
  assert.equal(goal.miles,10000);
  assert.equal(goal.remaining,500);
  const full = Lab.pudding({meal:0,soup:0,pudding:120});
  assert.equal(full.miles,12000);
  assert.equal(full.remaining,0);
  const mixed = Lab.pudding({meal:10,soup:0,pudding:40});
  assert.equal(mixed.cost,3000);
  assert.equal(mixed.miles,5000);
  assert.equal(Lab.pudding({meal:0,soup:0,pudding:120},true).miles,3000);
  assert.equal(Lab.pudding({meal:0,soup:10,pudding:0},true).efficiency,100);
  assert.equal(Lab.pudding({meal:0,soup:0,pudding:0}).efficiency,0);
});

test('fixed voters have a 60/40 split; valid row and column maps reverse control', () => {
  assert.equal(Lab.voters.length,25);
  assert.equal(Lab.voters.filter(p=>p==='A').length,15);
  assert.equal(Lab.voters.filter(p=>p==='B').length,10);
  const columns = Lab.districts(Lab.columns());
  const rows = Lab.districts(Lab.rows());
  assert.equal(columns.valid,true);
  assert.equal(columns.a,5);
  assert.equal(columns.b,0);
  assert.equal(rows.valid,true);
  assert.equal(rows.a,2);
  assert.equal(rows.b,3);
});

test('unequal district populations invalidate the whole plan', () => {
  const plan = Lab.columns();
  plan[0]=1;
  const result = Lab.districts(plan);
  assert.equal(result.valid,false);
  assert.equal(result.groups[0].size,4);
  assert.equal(result.groups[1].size,6);
  assert.equal(result.a,null);
  assert.equal(result.b,null);
});

test('five voters are insufficient when a district is disconnected', () => {
  const plan = Lab.columns();
  [plan[0],plan[24]]=[plan[24],plan[0]];
  const result=Lab.districts(plan);
  assert.equal(result.groups[0].size,5);
  assert.equal(result.groups[4].size,5);
  assert.equal(result.groups[0].connected,false);
  assert.equal(result.valid,false);
  assert.equal(result.a,null);
});

test('adjacency never wraps from one row into the next', () => {
  const plan=Lab.rows();
  // Cells 4 and 5 are consecutive indices, but share no edge.
  [plan[0],plan[5]]=[plan[5],plan[0]];
  const result=Lab.districts(plan);
  assert.equal(result.groups[0].size,5);
  assert.equal(result.groups[0].connected,false);
  assert.equal(result.valid,false);
});

test('invalid district IDs and map lengths are rejected', () => {
  assert.throws(()=>Lab.districts([0]));
  assert.throws(()=>Lab.districts(Array(25).fill(5)));
});

test('full coverage guarantees a number, while payout controls profit', () => {
  const solo=Lab.lottery(100,250,0);
  assert.equal(solo.cost,200);
  assert.equal(solo.chance,1);
  assert.equal(solo.expected,50);
  assert.equal(Lab.lottery(100,250,1).expected,-75);
  assert.equal(Lab.lottery(100,100,0).expected,-100);
  assert.equal(Lab.lottery(100,200,0).expected,0);
});

test('partial coverage and co-winners are included in expected value', () => {
  assert.equal(Lab.lottery(1,250,0).expected,.5);
  const partial=Lab.lottery(50,300,2);
  assert.equal(partial.chance,.5);
  assert.equal(partial.prize,100);
  assert.equal(partial.expected,-50);
});
