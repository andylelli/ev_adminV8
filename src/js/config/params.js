//set tables list
var params = [
    {
        table: "lookup",
        db: ['lookup_id', 'lookup_value', 'lookup_eventid', 'lookup_unixtime'],
    },
    {
        table: "user",
        db: ['user_id', 'user_firstname', 'user_lastname', 'user_email', 'user_defaulteventid', 'user_unixtime'],
        localOnly: true,
    },
    {
        table: "event",
        displayName: "event",
        newSheetEdit: "event",
        db: ['event_id', 'event_name', 'event_pos', 'event_image', 'event_startdate', 'event_enddate', 'event_dailyendtime', 'event_autosync', 'event_darktheme', 'event_hideqrtype', 'event_userid', 'event_unixtime'],
        decode: ['event_name'],
        fields: [
            {
                name: "name",
                placeholder: "Name",
                type: "text",
            }
        ]
    },
    {
        table: "project",
        key: "eventid",
        displayName: "project",
        db: ['project_id', 'project_position', 'project_name', 'project_image', 'project_display', 'project_typeid', 'project_code', 'project_eventid', 'project_appicon', 'project_unixtime'],
        decode: ['project_name'],
        fields: [
            {
                name: "name",
                placeholder: "Name",
                type: "text",
            }
        ],
        sort: true
    },
    {
        table: "poll",
        displayName: "poll",
        newSheetName: "project",
        db: ['poll_id', 'poll_type', 'poll_imageid', 'poll_live', 'poll_projectid', 'poll_eventid', 'poll_unixtime'],
        icon: 'poll',
        linkSuffix: '/',
        childTables: ['pollitem', 'pollscore']
    },
    {
        table: "scoreboard",
        displayName: "scoreboard",
        newSheetName: "project",
        db: ['scoreboard_id', 'scoreboard_allusers', 'scoreboard_live', 'scoreboard_eventid', 'scoreboard_projectid', 'scoreboard_unixtime'],
        icon: 'award',
        linkSuffix: '/',
        childTables: ['scoreboardscore']
    },
    {
        table: "pindrop",
        displayName: "map",
        newSheetName: "project",
        db: ['pindrop_id', 'pindrop_eventid', 'pindrop_projectid', 'pindrop_unixtime'],
        icon: 'map',
        linkSuffix: '/0/0/'
    },
    {
        table: "directory",
        displayName: "directory",
        newSheetName: "project",
        db: ['directory_id', 'directory_parentid', 'directory_mapid', 'directory_imageid', 'directory_scheduleid', 'directory_colourid', 'directory_shopid', 'directory_hidenames', 'directory_hidetype', 'directory_eventid', 'directory_projectid', 'directory_unixtime'],
        icon: 'book',
        linkSuffix: '/',
        childTables: ['directoryentry']
    },
    {
        table: "shop",
        displayName: "shop",
        newSheetName: "project",
        db: ['shop_id', 'shop_imageid', 'shop_eventid', 'shop_projectid', 'shop_unixtime'],
        icon: 'shopping-bag',
        linkSuffix: '/0/',
        childTables: ['shopitem']
    },
    {
        table: "hunt",
        displayName: "treasure hunt",
        newSheetName: "project",
        db: ['hunt_id', 'hunt_imageid', 'hunt_eventid', 'hunt_projectid', 'hunt_unixtime'],
        icon: 'treasure-chest',
        linkSuffix: '/',
        childTables: ['huntitem']
    },
    {
        table: "news",
        displayName: "news",
        newSheetName: "news",
        db: ['news_id', 'news_imageid', 'news_eventid', 'news_projectid', 'news_unixtime'],
        icon: 'megaphone',
        linkSuffix: '/',
        childTables: ['newsitem']
    },
    {
        table: "schedule",
        displayName: "schedule",
        newSheetName: "project",
        db: ['schedule_id', 'schedule_imageid', 'schedule_eventid', 'schedule_projectid', 'schedule_unixtime'],
        icon: 'calendar',
        linkSuffix: '/',
    },
    {
        table: "pollitem",
        key: "pollid",
        displayName: "poll item",
        newSheetName: "pollitem",
        db: ['pollitem_id', 'pollitem_position', 'pollitem_name', 'pollitem_image', 'pollitem_text', 'pollitem_pollid', 'pollitem_eventid', 'pollitem_unixtime'],
        decode: ['pollitem_name', 'pollitem_text'],
        fields: [
            {
                name: "name",
                placeholder: "Name",
                type: "text",
            },
            {
                name: "text",
                placeholder: "Description",
                type: "text",
                optional: true,
            }
        ],
        sort: true,
        link: false
    },
    {
        table: "pollscore",
        db: ['pollscore_id', 'pollscore_guestid', 'pollscore_pollitemid', 'pollscore_pollid', 'pollscore_eventid', 'pollscore_unixtime'],
    },
    {
        table: "scoreboardscore",
        db: ["scoreboardscore_id", "scoreboardscore_guestid", "scoreboardscore_count", "scoreboardscore_scoreboardid", "scoreboardscore_eventid", "scoreboardscore_unixtime"],
    },
    {
        table: "directoryentry",
        key: "directoryid",
        displayName: "directory entry",
        newSheetName: "directoryentry",
        db: ['directoryentry_id', 'directoryentry_position', 'directoryentry_name', 'directoryentry_image', 'directoryentry_lightcolour', 'directoryentry_darkcolour', 'directoryentry_mapid', 'directoryentry_lat', 'directoryentry_lng', 'directoryentry_shorttext', 'directoryentry_longtext', 'directoryentry_directoryid', 'directoryentry_parententryid', 'directoryentry_shopid', 'directoryentry_day', 'directoryentry_hour', 'directoryentry_minute', 'directoryentry_schedulehide', 'directoryentry_favourite', 'directoryentry_eventid', 'directoryentry_unixtime'],
        decode: ['directoryentry_name', 'directoryentry_shorttext', 'directoryentry_longtext'],
        bulkInsert: {
            directoryentry_name: ['string', 50],
            directoryentry_mapid: ['number', 9],
            directoryentry_shorttext: ['string', 200],
            directoryentry_longtext: ['string', 1000],
            directoryentry_parententryid: ['number', 9],
            directoryentry_day: ['number', 12],
            directoryentry_hour: ['number', 2],
            directoryentry_minute: ['number', 2],
            directoryentry_schedulehide: ['boolean', 1],
        },
        fields: [
            {
                name: "name",
                placeholder: "Name",
                type: "text",
            },
            {
                name: "shorttext",
                placeholder: "Short Description",
                type: "text",
                optional: true,
            },
            {
                name: "longtext",
                placeholder: "Long Description",
                type: "text",
                optional: true,
            }
        ],
        sort: true,
        link: true
    },
    {
        table: "shopitem",
        key: "shopid",
        displayName: "shop item",
        newSheetName: "shopitem",
        db: ['shopitem_id', 'shopitem_position', 'shopitem_name', 'shopitem_price', 'shopitem_text', 'shopitem_image', 'shopitem_eventid', 'shopitem_shopid', 'shopitem_unixtime'],
        decode: ['shopitem_name', 'shopitem_text'],
        fields: [
            {
                name: "name",
                placeholder: "Name",
                type: "text",
                maxlen: "???"
            },
            {
                name: "text",
                placeholder: "Description",
                type: "text",
                maxlen: "???",
                optional: true,
            },
            {
                name: "price",
                placeholder: "Price",
                type: "number",
                maxlen: "???"
            },
        ],
        sort: true,
        link: false
    },
    {
        table: "huntitem",
        key: "huntid",
        displayName: "treasure hunt item",
        newSheetName: "huntitem",
        db: ['huntitem_id', 'huntitem_position', 'huntitem_name', 'huntitem_text', 'huntitem_image', 'huntitem_token', 'huntitem_scanned', 'huntitem_eventid', 'huntitem_huntid', 'huntitem_unixtime'],
        decode: ['huntitem_name', 'huntitem_text'],
        fields: [
            {
                name: "name",
                placeholder: "Name",
                type: "text",
                maxlen: "???"
            },
            {
                name: "text",
                placeholder: "Text",
                type: "text",
                maxlen: "???",
                optional: true,
            }
        ],
        sort: true,
        link: false
    },
    {
        table: "newsitem",
        key: "newsid",
        displayName: "news item",
        newSheetName: "newsitem",
        db: ['newsitem_id', 'newsitem_title', 'newsitem_detail', 'newsitem_projectid', 'newsitem_directoryentryid', 'newsitem_time', 'newsitem_userid', 'newsitem_eventid', 'newsitem_newsid', 'newsitem_unixtime'],
        decode: ['newsitem_title', 'newsitem_detail'],
        fields: [
            {
                name: "name",
                placeholder: "Name",
                type: "text",
                maxlen: "???"
            },
            {
                name: "text",
                placeholder: "Text",
                type: "text",
                maxlen: "???",
                optional: true,
            }
        ],
        sort: true,
        sortReverse: true,
        sortTime: true,
        link: false
    },
    {
        table: "guest",
        displayName: "guest",
        newSheetName: "guest",
        db: ['guest_id', 'guest_firstname', 'guest_lastname', 'guest_email', 'guest_role', 'guest_token', 'guest_eventid', 'guest_unixtime'],
        decode: ['guest_firstname', 'guest_lastname'],
        fields: [
            {
                name: "firstname",
                placeholder: "First Name",
                type: "text",
            },
            {
                name: "lastname",
                placeholder: "Last Name",
                type: "text",
            },
            {
                name: "email",
                placeholder: "Email",
                type: "email",
            },
        ]
    },
    {
        table: "qrcode",
        db: ["qrcode_id", "qrcode_value", "qrcode_image", "qrcode_eventid", "qrcode_guestid", "qrcode_unixtime"],
        localOnly: true
    },
    {
        table: "order",
        db: ["order_id", "order_clientid", "order_shopid", "order_eventid", "order_datetime", "order_unixtime"],
    },
    {
        table: "orderdetail",
        db: ["orderdetail_id", "orderdetail_shopitemid", "orderdetail_quantity", "orderdetail_orderid", "orderdetail_eventid", "orderdetail_unixtime"],
    },
];

export default params;