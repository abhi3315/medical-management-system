window.onload = function () {

    const data = $('#chartContainer').data('patient')
    const chartData = Object.keys(data).map(value => {
        return {
            x: new Date(value),
            y: data[value]
        }
    })

    const chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: "Patient Chart"
        },
        axisY: {
            includeZero: false
        },
        data: [{
            type: "line",
            indexLabelFontSize: 16,
            dataPoints: chartData
        }]
    })
    chart.render()

}