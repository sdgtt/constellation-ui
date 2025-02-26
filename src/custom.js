document.addEventListener("DOMContentLoaded", function () {
    // Enable all Bootstrap tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(tooltip => new bootstrap.Tooltip(tooltip));

    // Enable all Bootstrap popovers
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    popoverTriggerList.forEach(popover => new bootstrap.Popover(popover));
});