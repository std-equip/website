
$(function() {
    $(".select").on("click", ".select__head", function () {
    if ($(this).hasClass("open")) {
        $(this).removeClass("open");
        $(this).closest('.select').find('.select__list').fadeOut();
        $(this).closest('.select').removeClass("select--open");
    } else {
        $(".select__head").removeClass("open");
        $(".select__list").fadeOut();
        $(".select").removeClass("select--open");
        $(this).addClass("open");
        $(this).closest('.select').find('.select__list').fadeIn();
        $(this).closest('.select').addClass("select--open")
    }
});

$(".select").on("click", ".select__item", function () {
    $(".select__head").removeClass("open");
    $(".select__list").fadeOut();
    $(".select").removeClass("select--open");
    $(this).closest('.select').find('input').val($(this).data('id'));
    if($(this).closest('.select').hasClass('select-reviews')){
        $(this).closest('.select').find('.select__head span').text($(this).text());
        $(this).closest('.select').find('input').change();
    } else{
        $(this).parent().prev().text($(this).text());
    }
    

});

$(document).click(function (e) {
    if (!$(e.target).closest(".select").length) {
        $(".select__head").removeClass("open");
        $(".select__list").fadeOut();
        $(".select").removeClass("select--open");
    }})
 });