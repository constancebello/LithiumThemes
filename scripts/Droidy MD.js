function renderBattery(height, percentage, charging, low, color) {
    var colorString = color.join(),
        barHeightMinusTwo = 2 * Math.round(height * 2 / 5),
        barHeight = barHeightMinusTwo + 2,
        widthMinusTwo = 2 * Math.round(barHeightMinusTwo * 5 / 16),
        width = widthMinusTwo + 2,
        cutWidth = Math.floor(1 + width * 3 / 14),
        cutHeight = Math.floor(1 + barHeight / 11),
        canvas = document.createElement("canvas"),
        context = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = barHeight;
    context.fillStyle = "rgba(" + colorString + ",0.3)";
    context.fillRect(1, 1, widthMinusTwo, barHeightMinusTwo);
    context.fillStyle = "rgb(" + colorString + ")";
    context.fillRect(1, barHeightMinusTwo * ((100 - percentage) / 100), widthMinusTwo, barHeightMinusTwo * percentage / 100);
    context.globalCompositeOperation = "destination-out";
    context.fillRect(0, 0, cutWidth, cutHeight);
    context.fillRect(width - cutWidth, 0, cutWidth, cutHeight);
    if(percentage < 6 && !charging) {
        context.font = barHeightMinusTwo * 0.625 + "pt HelveticaNeue-CondensedBold";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText("!", width / 2, barHeight / 2, widthMinusTwo);
    }
    if(charging) {
        context.beginPath();
        context.moveTo(width / 2 - height * 5 / 80, barHeight / 2 + height * 0.04);
        context.lineTo(width / 2 - height / 6, barHeight / 2 + height * 0.04);
        context.lineTo(width / 2 + height * 5 / 48, barHeight / 2 - height * 0.2);
        context.lineTo(width / 2 + height * 5 / 80, barHeight / 2 - height * 0.04);
        context.lineTo(width / 2 + height / 6, barHeight / 2 - height * 0.04);
        context.lineTo(width / 2 - height * 5 / 48, barHeight / 2 + height * 0.2);
        context.closePath();
        context.fill();
    }
    return canvas.toDataURL("image/png");
}
