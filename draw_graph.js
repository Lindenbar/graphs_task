function drawGraph(canvas, coordinates = false, calcScale = false, scale = 50, moveX = 2, moveY = 2) {

    // Расчитывает масштаб графика, на основе наибольшего значения координат в абсолюте.
    if (calcScale === true && coordinates) {
        let biggest;
        for (const ordinate of coordinates) {
            for (let xy of ordinate) {
                xy = Math.abs(xy);
                if (biggest === undefined) {
                    biggest = xy;
                } else if (biggest < xy) {
                    biggest = xy;
                }
            }
        }
        biggest === 0 ? biggest = 1 : biggest;
        scale = Math.round(scale / biggest) * 3;
    }

    // Убирает все слушатели. На всякий случай :)
    if (!canvas) {
        canvas = canvas.cloneNode(true);
    }

    // Переменные:
    canvas.width = canvas.closest('.table-box').clientWidth - 7;
    canvas.height = 400;

    let ctx = canvas.getContext('2d');
    let graphWidth = canvas.clientWidth;
    let graphHeight = canvas.clientHeight;
    let xAxis = Math.round((graphWidth / moveX / scale)) * scale;
    let yAxis = Math.round((graphHeight / moveY / scale)) * scale;

    let vertexSize = 7;
    let textShift = 7;

    ctx.lineWidth = scale * 0.01;
    ctx.font = `${scale / 2}px Arial`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    // Draw graph grid
    ctx.beginPath();
    ctx.strokeStyle = '#b0b4d3';
    ctx.fillStyle = '#888888';
    // Draw vertical graph grid
    for (let i = 0; i < graphWidth ; i += scale) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, graphHeight);
        ctx.stroke();
        // Draw Y numbers
        ctx.fillText((i - xAxis) / scale, i + textShift, yAxis + textShift);
    }
    // Draw horizontal graph grid
    for (let i = 0; i < graphHeight ; i += scale) {
        ctx.moveTo(0, i);
        ctx.lineTo(graphWidth, i);
        ctx.stroke();
        // Draw X numbers
        ctx.fillText((yAxis - i) / scale, xAxis + textShift, i + textShift);
    }
    ctx.closePath();

    // Draw axis
    ctx.beginPath();
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#000000';
    ctx.font = `${vertexSize * 3}px Serif`;
    // Draw X axis
    ctx.moveTo(0, yAxis);
    ctx.lineTo(graphWidth, yAxis);
    ctx.stroke();
    ctx.fillText('X', graphWidth - textShift * 3, yAxis - 25);
    // Draw Y axis
    ctx.moveTo(xAxis, 0);
    ctx.lineTo(xAxis, graphHeight);
    ctx.stroke();
    ctx.fillText('Y', xAxis - textShift * 3, textShift);

    // Disable window scroll when mouse over graphs
    canvas.onmouseenter = () => {
        document.body.classList.add('no-scroll');
    }
    // Enable window scroll when mouse leave graphs
    canvas.onmouseleave = () => {
        document.body.classList.remove('no-scroll');
    }

    // Graph zoom
    canvas.onwheel = (event) => {
        if (event.deltaY > 0) {
            if (scale > 1) {
                drawGraph(canvas, coordinates, false, scale -= 1);
            }
        } else {
            drawGraph(canvas, coordinates, false, scale += 1);
        }
    }

    // Graph move
    let lastX = 0;
    let lastY = 0;
    let moveSpeed = 0.05;

    function move(event) {

        if (lastX > event.pageX) { // left
            moveX += moveSpeed;
        } else if (lastX < event.pageX) { // right
            moveX -= moveSpeed;
        }

        if (lastY > event.pageY) { // top
            moveY += moveSpeed;
        } else if (lastY < event.pageY) { // bottom
            moveY -= moveSpeed;
        }
        lastX = event.pageX;
        lastY = event.pageY;
        drawGraph(canvas, coordinates, false, scale, moveX, moveY);
    }

    // Перемещать график при одновременном удержании и перемещении курсора.
    canvas.onmousedown = () => {
        canvas.addEventListener('mousemove', move);
        window.onmouseup = () => {
            canvas.removeEventListener('mousemove', move);
        };
        canvas.onmouseleave = () => {
            canvas.removeEventListener('mousemove', move);
        };
    }

    // Не отрисовывть линию, если координаты не переданы.
    if (coordinates === false ) return;

    // Draw lines
    let x;
    let y;
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    for (const xy of coordinates) {
        x = xAxis + scale * xy[0];
        y = yAxis + scale * -xy[1];
        // Draw vertexes
        ctx.fillRect(x - vertexSize / 2, y - vertexSize / 2, vertexSize, vertexSize);
        ctx.fillStyle = '#168a67';
        ctx.font = `${vertexSize * 3}px Serif`;
        ctx.fillText(`X:${xy[0]}; Y:${xy[1]}`, x, y - (vertexSize * 4));
        ctx.textAlign = 'center';
        // Draw ordinates
        ctx.fillStyle = 'red';
        ctx.moveTo(x, yAxis);
        ctx.lineTo(x, y);
        ctx.stroke();
    }
    ctx.closePath();
}

drawGraph(document.querySelector('.table-box:nth-child(1) .graph'));
drawGraph(document.querySelector('.table-box:nth-child(2) .graph'));
drawGraph(document.querySelector('.table-box:nth-child(3) .graph'));
