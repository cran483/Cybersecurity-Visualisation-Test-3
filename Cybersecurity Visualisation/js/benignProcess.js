export const benignProcess = (parent, props) => {
    const {
        srcAddresses,
        dstAddresses,
        updateNormalisedMatrix,
    } = props;
    
    let theData;
    let matrix = []

    d3.csv('data/benign.csv')
        .then(loadedBenignData => {
            console.log('in here')
            //console.log(loadedBenignData)
            theData = loadedBenignData;
            console.log(theData);
            //console.log(data)
            //console.log(theData + ' heres the data')
            //console.log('defined')

            function NodeSource(d,di){return theData.filter(function(e){return e.Source == d && e.Destination == di}).length};

            for (let i = 0; i < srcAddresses.length; i++){
                let jArray = []
                for (let j = 0; j < dstAddresses.length; j++){
                    let packetsPerSecond = NodeSource(srcAddresses[i],dstAddresses[j]) / (theData[theData.length-1].Time)
                    jArray.push(packetsPerSecond)
                }
                matrix.push(jArray)
            }
            console.log(matrix)
            updateNormalisedMatrix(matrix)

            /*creates file
            const jsonData = JSON.stringify(matrix, null, 2); // Pretty-print with 2 spaces
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'matrix.json';
            link.click();

            URL.revokeObjectURL(url); // Clean up*/
    })


}