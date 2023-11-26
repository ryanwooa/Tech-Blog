

window.addEventListener("load", async  function() {

let chart = null;
const startDatePicker = document.querySelector('#start-date');
const endDatePicker = document.querySelector('#end-date');
const submitButton = document.querySelector('#submitDateRange');
const dom = document.getElementById('chart-container');
const myChart = echarts.init(dom, null, { renderer: 'canvas', useDirtyRect: false });

// Initialize date pickers
const currentDate = new Date();
const nowDate = new Date();
nowDate.setHours(nowDate.getHours() + 12);
currentDate.setDate(currentDate.getDate() - 10);
startDatePicker.value = currentDate.toISOString().slice(0, 10);
endDatePicker.value = nowDate.toISOString().slice(0, 10);
updateChart();

// Event listeners for date pickers
submitButton.addEventListener('click', updateChart);

// Fetch data and update chart
async function updateChart() {
    const startDate = startDatePicker.value;
    const endDate = endDatePicker.value;

    const response = await fetch(`/api/comments-count?startDate=${startDate}&endDate=${endDate}`);
    const data = await response.json();

    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        },
        toolbox: {
            feature: {
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ['line', 'bar'] },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        legend: { data: ['Comments'] },
        xAxis: [
            {
                type: 'category',
                data: data.dateList,
                axisPointer: { type: 'shadow' }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: 'Comments',
                axisLabel: { formatter: '{value}' }
            }
        ],
        series: [
            {
                name: 'Comments',
                type: 'bar',
                tooltip: { valueFormatter: function (value) { return value + ' comments'; } },
                data: data.commentCounts
            }
        ]    
    };

    if (option && typeof option === 'object') {
        myChart.setOption(option, true);
        myChart.resize();
    }
}



});

// Initial chart update
// window.addEventListener('resize', myChart.resize);
