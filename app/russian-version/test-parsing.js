// Test the question parsing logic
const sampleResponse = `
1. Кто является главным героем рассказа?
   А) Молодой студент
   Б) Пожилой профессор
   В) Школьный учитель
   Г) Маленький мальчик

2. Где происходит действие рассказа?
   А) В московском парке
   Б) В сибирской деревне
   В) В петербургском музее
   Г) В волгоградской школе
`;

// Simulate the parsing logic
const questionBlocks = sampleResponse
  .split(/\d+\./)
  .slice(1)
  .map(block => block.trim())
  .filter(block => block.length > 0);

console.log('Question blocks:');
questionBlocks.forEach((block, i) => {
  console.log(`Block ${i + 1}:`, block);
  
  const lines = block.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  console.log('Lines:', lines);
  
  if (lines.length > 0) {
    const question = lines[0];
    const options = lines.slice(1).filter(line => /^[АБВГабвг]\)/.test(line));
    
    console.log('Question:', question);
    console.log('Options:', options);
    console.log('Options count:', options.length);
    console.log('---');
  }
});