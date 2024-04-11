<template>
    <f7-sheet class="justify-content-center" id="new-item" style="height: auto; --f7-sheet-bg-color: #fff"
        swipe-to-close backdrop @sheet:close="clearForm()">
        <f7-page-content>
            <f7-block class="padding-top">
                <f7-block-title class="padding-bottom">
                    {{ this.title }}</f7-block-title>
                <f7-list form>
                    <f7-list-input class="new-field" v-for="field in this.setFields" :key="field.name"
                        :id="fieldId(field.name)" :type="field.type" step="0.01" :placeholder="field.placeholder"
                        @input="update(field.name, $event)" validate required></f7-list-input>
                </f7-list>
                <div style="padding-left: 25px; padding-right: 25px; height: 50px">
                    <div v-show="this.allowChange != false">
                        <general-button class="margin-top margin-bottom" @generalButtonAction="submit()" label="CREATE"
                            width="200" type="fill"></general-button>
                    </div>
                </div>
            </f7-block>
        </f7-page-content>
    </f7-sheet>
</template>

<script>
import store from "../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";
import { Dom7 } from "framework7";
var $$ = Dom7;

import misc from "../../mixins/misc";
import newItem from "../../mixins/newItem";
import login from "../../mixins/login";
import fetch from "../../mixins/fetch";

import generalButton from "../misc/generalButton.vue";

import params from "../../js/config/params.js";
import escape from "../../js/config/escape.js";

export default {
    name: "sheet-new",
    data() {
        return {
            event: store.state.event,
            displayName: null,
            subtable: null,
            data: {},
            fields: [],
            allowChange: false,
        };
    },
    props: ["sortAlpha", "refresh"],
    mixins: [misc, newItem, login, fetch],
    components: {
        generalButton,
    },
    inject: ["eventBus"],
    computed: {
        setData() {
            return this.data;
        },
        setFields() {
            return this.fields;
        },
        title() {
            var title = "NEW " + this.displayName + " ITEM";
            return title.toUpperCase();
        },
        isRefresh() {
            if (this.refresh == "true") {
                return true;
            } else {
                return false;
            }
        },
    },
    methods: {
        update(name, event) {
            this.data[name] = event.target.value;
            this.allowChange = true;
        },
        fieldId(field) {
            var sheetId = "new-item";
            return sheetId + "-" + field;
        },
        clearForm() {
            this.data = {};
            this.fields = [];
        },
        isValid() {
            var isValid = true;
            var str;
            for (var i = 0; i < this.fields.length; i++) {
                str = this.data[this.fields[i].name];
                if (str.length > 0) {
                    var validate = f7.input.validateInputs(
                        "#" + this.fieldId(this.fields[i].name)
                    );
                    if (validate == false) {
                        isValid = false;
                    }
                    if (this.fields[i].type === "number") {
                        this.data[this.fields[i].name] = parseInt(
                            this.data[this.fields[i].name]
                        );
                    }
                } else {
                    isValid = false;
                }
            }
            return isValid;
        },
        submit() {
            if (this.isValid() === true) {
                var userid = store.state.userid;
                var eventid = store.state.eventid;

                var targetTable = this.table;
                if (this.subtable) {
                    targetTable = this.subtable;
                }

                var json = {
                    userid: userid,
                    eventid: eventid,
                    projectid: this.projectid,
                    table: targetTable,
                };
                for (var i = 0; i < this.fields.length; i++) {
                    json[this.fields[i].name] = escape.encodeXML(
                        this.data[this.fields[i].name]
                    );
                }

                this.newItem(json, this.table, true, this.displayName, this.isRefresh);

                f7.sheet.close("#new-item", true);

                this.allowChange = false;
            }
        },
    },
    beforeMounted() { },
    mounted() {
        f7ready((f7) => {
            var vue = this;
            f7.sheet.create({
                el: "new-item",
                closeByBackdropClick: true,
                swipeToClose: true,
                backdrop: true,
            });

            vue.eventBus.on("new-item", (json) => {

                vue.projectid = json.projectId;
                vue.table = json.table;
                vue.displayName = json.projectName;
                if (json.subtable) {
                    vue.subtable = json.subtable;
                    if (vue.subtable == "pindrop") {
                        vue.displayName = "map";
                    }
                }
                else {
                    vue.subtable = null;
                }

                var findTable = params.filter(function (result) {
                    return result.table === vue.table;
                });

                var sheetFields = findTable[0].fields;
                for (var i = 0; i < sheetFields.length; i++) {
                    if (!sheetFields[i].optional) {
                        vue.fields.push(sheetFields[i]);
                        vue.data[vue.fields[i].name] = "";
                    }
                }

                // CLEAR FORM
                $$(".new-field input").val("");
                $$(".item-input-error-message").html("");

                // OPEN SHEET
                f7.sheet.open("#new-item", true);
            });
        });
    },
};
</script>

<style scoped>
@media (min-width: 1024px) {
    .sheet-modal {
        margin-left: 25%;
        width: 50% !important;
    }
}
</style>