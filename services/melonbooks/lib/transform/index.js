'use strict'
module.exports = function (q) {
    var help = {
        mak: 'circle'
      , nam: 'title'
      , act: 'author'
      , mch: 'chara'
      , gnr: 'genre'
      , com: 'detail'
    }

    return {
        mode:               'search'
      , orderby:            'date'
      , disp_number:        120
      , pageno:             1
      , text_type:          help[q.category] || 'selected'
      , name:               q.value
      , 'is_end_of_sale[]': 1
      , is_end_of_sale2:    1
      , 'category_ids[]':   1
      , genre:              0
      , co_name:            ''
      , ci_name:            ''
      , sale_date_before:   ''
      , sale_date_after:    ''
      , price_row:          0
      , price_high:         0
    }
}
