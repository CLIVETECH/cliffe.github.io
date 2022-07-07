(function($) {
    $(document).ready(function() {
      $(".nta_wa_button").each(function(i, element){
        const id = $(element).data('id')
        $(element).njtWhatsAppButton({
            ...window['njt_wa_button_' + id], 
            timezone: njt_wa_global.timezone,
            i18n: njt_wa_global.i18n,
            urlSettings: njt_wa_global.urlSettings
        })
      })
    });
})($j_njt);
  