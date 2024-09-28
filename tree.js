document.addEventListener('DOMContentLoaded', () => {
    const treeCount = 36; // Adjusted to match plant items
    const goodCountElem = document.getElementById('good-count');
    const badCountElem = document.getElementById('bad-count');
    const startSpeechBtn = document.getElementById('mic');

    let goodCount = 0;
    let badCount = 0;

    // Update the plant grid
    const grid = document.getElementById('tree-grid');
    for (let i = 1; i <= treeCount; i++) {
        const plantItem = document.createElement('div');
        plantItem.classList.add('plant-item');
        plantItem.innerText = i; // Show tree number
        grid.appendChild(plantItem);
    }

    // Check for speech recognition support
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        alert('Your browser does not support speech recognition. Please use Chrome or Edge.');
        return;
    }

    // Start speech recognition on button click
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

            if (plantNumber !== null && status !== null && plantNumber >= 1 && plantNumber <= treeCount) {
                if (status === 'good') {
                    goodCount++;
                } else if (status === 'bad') {
                    badCount++;
                }
                updatePlantCondition(plantNumber, status);
                updateCounts();
            } else {
                alert('Please provide a valid input.');
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
        };

        recognition.onend = () => {
            console.log('Speech recognition ended');
        };
    }

    function updatePlantCondition(plantNumber, status) {
        const plantItems = document.querySelectorAll('.plant-item');
        const plantItem = plantItems[plantNumber - 1]; // Adjust index for zero-based

        if (status === 'good') {
            plantItem.style.backgroundColor = 'lightgreen';
            plantItem.textContent += ' - Good';
        } else if (status === 'bad') {
            plantItem.style.backgroundColor = 'lightcoral';
            plantItem.textContent += ' - Bad';
        }
    }

    function updateCounts() {
        goodCountElem.textContent = goodCount;
        badCountElem.textContent = badCount;
    }
});
