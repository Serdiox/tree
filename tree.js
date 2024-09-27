document.addEventListener('DOMContentLoaded', () => {
    const treeCount = 24; 
    const treeGrid = document.getElementById('tree-grid');
    const goodCountElem = document.getElementById('good-count');
    const badCountElem = document.getElementById('bad-count');
    const startSpeechBtn = document.getElementById('mic');
    
    let goodCount = 0;
    let badCount = 0;

    let totalPlant = document.getElementById('total-plant');
    let soilTemp = document.getElementById('soil-temp');
    let humidity = document.getElementById('humidity');
    let plantCondition = document.getElementById('plant-condition');

    totalPlant.innerText = '24°';
    soilTemp.innerText = '24°';
    humidity.innerText = '24°';
    plantCondition.innerText = 'Good';
    
    const grid = document.querySelector('.grid');
    let cnt = 1;
    for (let i = 0; i < 36; i++) {
        const plantItem = document.createElement('div');
        plantItem.classList.add('plant-item');
        plantItem.innerText = cnt++;
        grid.appendChild(plantItem);
    }

    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        alert('Your browser does not support speech recognition. Please use Chrome or Edge.');
        return;
    }

    startSpeechBtn.addEventListener('click', () => {
        console.log('Button clicked! Starting speech recognition...');
        startSpeechCommand();
    });

    function startSpeechCommand() {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.start();

        recognition.onstart = () => {
            console.log('Speech recognition started');
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            console.log('Transcript received:', transcript);

            const words = transcript.split(" ");
            let plantNumber = null;
            let status = null;
            
            words.forEach(word => {
                if (word.match(/^\d+$/)) {
                    plantNumber = parseInt(word);
                } else if (word === 'good' || word === 'bad') {
                    status = word;
                }
            });

            if (plantNumber !== null && status !== null) {
                const plantItem = document.querySelector(`.plant-item:nth-child(${plantNumber})`);
                
                if (plantItem) {
                    plantItem.classList.remove('good', 'bad');

                    if (status === 'good') {
                        plantItem.classList.add('good');
                        goodCount++;
                        goodCountElem.innerText = goodCount;
                    } else if (status === 'bad') {
                        plantItem.classList.add('bad');
                        badCount++;
                        badCountElem.innerText = badCount;
                    }
                } else {
                    alert('Invalid plant number');
                }
            } else {
                alert('Please say the plant number followed by "good" or "bad"');
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            if (event.error === 'not-allowed') {
                alert('Microphone access was denied. Please check your settings.');
            } else {
                alert('An error occurred with speech recognition. Please try again.');
            }
        };

        recognition.onend = () => {
            console.log('Speech recognition ended');
        };
    }
});
