function renderBattery(height, percentage, charging, low, color) {
    var barWidth = Math.floor(height * 5 / 4),
        barHeight = Math.floor(height * 3 / 5),
        radius = Math.ceil(height / 15),
        smallRadius = Math.ceil(height / 30),
        fullWidth = 2 + barWidth + radius * 2,
        fullHeight = 2 + barHeight,
        canvas = document.createElement("canvas"),
        context = canvas.getContext("2d"),
        colorString = "rgb(" + color.join() + ")",
        offset = radius + smallRadius / 2,
        innerBarWidth = barWidth - radius * 2,
        pi = Math.PI;
    canvas.width = fullWidth;
    canvas.height = fullHeight;
    context.lineWidth = smallRadius;
    context.strokeStyle = colorString;
    context.arc(1 + offset, 1 + offset, radius, pi, pi * 1.5);
    context.arc(1 + barWidth - offset, 1 + offset, radius, pi * 1.5, 0);
    context.arc(1 + barWidth - offset, fullHeight - offset - 1, radius, 0, pi / 2);
    context.arc(1 + offset, fullHeight - offset - 1, radius, pi / 2, pi);
    context.closePath();
    context.stroke();
    context.fillStyle = colorString;
    context.beginPath();
    context.arc(1 + barWidth + radius / 2, fullHeight / 2, radius * 1.5, pi * 1.5, pi / 2);
    context.closePath();
    context.fill();
    if(low && !charging)
        context.fillStyle = "#FF3B30";
    if(!charging || percentage == 100) {
        context.beginPath();
        context.arc(1 + radius + smallRadius, 1 + radius + smallRadius, smallRadius, pi, pi * 1.5);
        context.arc(1 + radius + innerBarWidth * percentage / 100 - smallRadius, 1 + radius + smallRadius, smallRadius, pi * 1.5, 0);
        context.arc(1 + radius + innerBarWidth * percentage / 100 - smallRadius, fullHeight - radius - smallRadius - 1, smallRadius, 0, pi / 2)
        context.arc(1 + radius + smallRadius, fullHeight - radius - smallRadius - 1, smallRadius, pi / 2, pi);
        context.closePath();
        context.fill();
    }
    if(charging) {
        function lightningPath(centerX, centerY) {
            context.beginPath();
            context.moveTo(centerX - height * 5 / 64, centerY + height * 0.06);
            context.lineTo(centerX - height / 4, centerY + height * 0.06);
            context.lineTo(centerX + height * 5 / 32, centerY - height * 0.3);
            context.lineTo(centerX + height * 5 / 64, centerY - height * 0.06);
            context.lineTo(centerX + height / 4, centerY - height * 0.06);
            context.lineTo(centerX - height * 5 / 32, centerY + height * 0.3);
            context.closePath();
        }
        context.globalCompositeOperation = "destination-out";
        for(var i = 0; i < 4; i++) {
            for(var j = 0; j < 4; j++) {
                lightningPath(1 + barWidth * (0.475 + 0.02 * i), 1 + barHeight * (0.475 + 0.02 * j));
                context.fill();
            }
        }
        context.globalCompositeOperation = "source-over";
        lightningPath(1 + barWidth / 2, fullHeight / 2);
        context.fill();
    }
    return canvas.toDataURL("image/png");
}
