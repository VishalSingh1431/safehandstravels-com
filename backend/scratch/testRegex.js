import pool from '../config/database.js';

async function testRegex() {
  const text = '<strong>Hello World\r\nTest\n<strong>Another bold\nNo bold here';
  console.log('Original:');
  console.log(text);
  
  const fixed = text.replace(/<strong>([^<\n\r]*)/g, '<strong>$1</strong>');
  console.log('\nFixed:');
  console.log(fixed);
}

testRegex().then(() => process.exit(0));
