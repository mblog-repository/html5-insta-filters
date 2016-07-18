// cache selectors
let $loader = $('#loader'),
    $filters = $('#filters'),
    $photoBox = $('#photo-box'),
    $filePicker = $('#file-picker'),
    $label = $photoBox.find('.label'),
    $downloadLink = $('#download-link');

let currentPreset = 'original',
    uploadedFileName = 'image';

// create image
let image = new Image();
let maxWidth = $photoBox.width(),
    maxHeight = $photoBox.height(),
    imageWidth = maxWidth,
    imageHeight = maxHeight;

image.onload = function() {
    let width = this.width,
        height = this.height;

    if (width >= maxWidth || height >= maxHeight) {
        if (width > height) {
            let ratio = width / maxWidth;
            imageWidth = maxWidth;
            imageHeight = height / ratio;
        } else {
            let ratio = height / maxHeight;
            imageHeight = maxHeight;
            imageWidth = width / ratio;
        }
    } else {
        imageWidth = width;
        imageHeight = height;
    }

    $label.hide();

    // Show filters block
    $filters.addClass('active');
    // trigger first filter (Original)
    $filters.find('.preset')
            .first()
            .trigger('click');

    // find old canvas
    let $oldCanvas = $photoBox.find('canvas');

    // Create new canvas element and set its sizes
    let $photo = $('<canvas>').addClass('photo').attr({
        id: 'photo',
        width: imageWidth,
        height: imageHeight
    }).css({
        width: $oldCanvas.width() || '0px',
        heigth: $oldCanvas.height() || '0px'
    });

    // Delete previous canvas
    $oldCanvas.remove();

    // append canvas to #photo-box
    $photoBox.append($photo);

    // get ctx and draw image
    let ctx = $photo[0].getContext('2d');
    ctx.drawImage(this, 0, 0, imageWidth, imageHeight);

    // Then image on canvas 
    // we change canvas size with animation
    $photo.css({
    width: imageWidth + 'px',
    height: imageHeight + 'px'
    });

    $loader.hide();
}

function uploadFile(file) {
    if (file.type.match('image/jpeg') || file.type.match('image/png')) {
        $loader.show();
        image.src = URL.createObjectURL(file);
        uploadedFileName = file.name.split('.').shift();
    } else {
        alert('Поддерживаются только файлы jpg и png');
    }
}

/**
  * Photobox events
  */
$photoBox
    .on('dragenter', event => {
        $(event.target).addClass('dragenter');
        event.preventDefault();
    })
    .on('dragleave', event => {
        $(event.target).removeClass('dragenter');
        event.preventDefault();
    })
    .on('dragover', event => {
        event.preventDefault();
    })
    .on('drop', event => {
        $(event.target).removeClass('dragenter');

        if (event.originalEvent.dataTransfer.files.length) {
            uploadFile(event.originalEvent.dataTransfer.files[0]);
        }

        event.preventDefault();
    })
    .on('click', (event) => {
        $filePicker.trigger('click');
    });

$filePicker.on('change', event => {
    if (event.target.files.length) {
        uploadFile(event.target.files[0]);
    }
});

$filters.on('click', '.preset', event => {
    let $this = $(event.target),
        preset = $this.data('preset');

    $this
        .addClass('active')
        .siblings()
        .removeClass('active');

    Caman('#photo', function() {
        this.reset();

        $downloadLink.removeClass('show');
        currentPreset = preset;

        if (preset !== 'original') {
            this[preset]();
            this.render();
            $downloadLink.addClass('show');
        }
    });

    event.preventDefault();
});

Caman.Event.listen("processStart", function(job) {
    $loader.show();
});

Caman.Event.listen("renderFinished", function() {
    $loader.hide();
});

$filters.on('mousewheel', function(event, delta) {
    this.scrollLeft -= (delta * 70);
    event.preventDefault();
});

$downloadLink.on('click', event => {
    let link = event.target,
        canvas = document.getElementById('photo');

    link.href = canvas.toDataURL();
    link.download = `${uploadedFileName}-${currentPreset}.png`;
});