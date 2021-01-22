var sku = $("meta[property='prudsys:recomm:productid']").length > 0 ? $("meta[property='prudsys:recomm:productid']").attr('content').substr(4).toString() : $('span[itemprop=sku]').text();

$( ".deliveryMethod input" ).click(function() {
  if(this.id === "delivery2"){
    $(".price-sidebar .price-button").html('<a href="#" class="button large block add-to-cart zipCodeInactive" id="pdp-add-to-cart" ><span>Bestel nu</span></a>');
    $(".price-sidebar .price-button a").addClass("zipCodeInactive");
  
    if($(".zipChecker").length === 0){
      $('<div class="zipChecker"><span>Jouw postcode: <span class="mandatory">*</span></span><br><input type="text" name="" placeholder="1234 AB" value="" id="zipCode" maxlength="7"><span class="ms-icon ms-icon--type_search ms-button2__only-icon"></span></div>').insertAfter($(".deliveryMethod #delivery2").parent());
      $("#zipCode").focus();
    }
    
    $( ".zipChecker input[type='text']" ).on("input", function(){
      var postcode = this.value.replace(' ', '');

      if (postcode.length === 6) {
        $(".deliveryMethod .zipChecker .ms-icon").addClass("active");
      }else{
        $(".deliveryMethod .zipChecker .ms-icon").removeClass("active");
        $( ".deliveryMethod .zipChecker .ms-icon" ).addClass("ms-icon--type_search");
        $( ".deliveryMethod .zipChecker .ms-icon" ).removeClass("checked");
        $( ".zipChecker input" ).removeClass("correct");
        $(".zipIncorrect").remove();
        $(".price-sidebar .price-button").html('<a href="#" class="button large block add-to-cart zipCodeInactive" id="pdp-add-to-cart" ><span>Bestel nu</span></a>');
        $(".price-sidebar .price-button a").addClass("zipCodeInactive");
      }
    });	
    
    $( ".zipChecker input[type='text']" ).keypress(function (e) {
      var key = e.which;
      if(key == 13){
        $( ".deliveryMethod .zipChecker .ms-icon" ).click();
        return false;  
      }
    });  
    
    $( ".deliveryMethod .zipChecker .ms-icon" ).click(function(e) {
      e.preventDefault();
      
      if ($(".deliveryMethod .zipChecker .ms-icon.active").length > 0) {
        zipCode = $( ".zipChecker input").val();
        checkZipCode(sku, zipCode);
      }
    });
  
  }else{
    $(".zipChecker").remove();
    $(".price-sidebar .price-button").html(originalButton);
    $(".price-sidebar .price-button a").removeClass("zipCodeInactive");
  }
});

function checkZipCode(sku, zipCode){
  $(".zipIncorrect").remove();
  
  var url = 'https://www.mediamarktlabs.nl/api/store-24-delivery/?p=' + zipCode.replace(' ', '') +'&sku=' + sku;
  
  $.ajax({
    url: url,
    success: function(data) {

      if(data.stores !== null){

        $( ".deliveryMethod .zipChecker .ms-icon" ).removeClass("ms-icon--type_search");
        $( ".deliveryMethod .zipChecker .ms-icon" ).addClass("checked");
        $( ".zipChecker input" ).addClass("correct");

        $(".price-sidebar .price-button").html(originalButton);

        var current24hSKU = getCookieValue("MC_24H_SKU") || "";
        current24hSKU = current24hSKU.length ? current24hSKU.split(",") : [];

        current24hSKU.push(sku);

        document.cookie = "MC_STORE_ID=" + data.stores.id + ";path=/;";
        document.cookie = "MC_24H_STORE_ID=" + data.stores.id + ";path=/;";
        document.cookie = "MC_24H_SKU=" + current24hSKU.join(",") + ";path=/;";
        
      }else{
        if($(".zipIncorrect").length === 0){
          $("<span class='zipIncorrect'>Op deze postcode kunnen we dit product helaas niet lokaal bezorgen, kies ‘Bezorging door PostNL’.</span>").appendTo(".zipChecker");
        }
    
      }
    }
  });
}