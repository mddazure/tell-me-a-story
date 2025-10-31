const fetch = require('node-fetch');

async function testRussianAPI() {
    try {
        const response = await fetch('http://localhost:3001/api/generate-story', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: "adventure",
                characters: ["девочка"],
                settings: ["лес"],
                theme: "дружба"
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.log('Error response:', response.status, errorText);
            return;
        }

        const data = await response.json();
        console.log('Success! Story generated:');
        console.log(data.story.substring(0, 200) + '...');
    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

testRussianAPI();