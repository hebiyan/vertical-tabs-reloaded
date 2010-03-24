var MultiSelect = {
    /*
     * Support for "selecting" multiple tabs
     */

    init: function() {
        var tabs = document.getElementById("tabbrowser-tabs");
        tabs.addEventListener('mousedown', this, true);
        tabs.addEventListener('TabSelect', this, false);
    },

    toggleMultiSelect: function(aTab) {
        if (aTab.selected) {
            let tab = this.findClosestMultiSelectedTab(aTab);
            let tabs = document.getElementById("tabbrowser-tabs");
            if (tab) {
                tab.setAttribute("multiselect-noclear", "true");
                tabs.tabbrowser.selectedTab = tab;
            }
            return;
        }
        if (aTab.getAttribute("multiselect") == "true") {
            aTab.removeAttribute("multiselect");
        } else {
            aTab.setAttribute("multiselect", "true");
        }
    },

    findClosestMultiSelectedTab: function(aTab) {
        var tabs = document.getElementById("tabbrowser-tabs");
        var i = 1;
        var tab;
        while ((aTab._tPos - i >= 0) ||
               (aTab._tPos + i < tabs.childNodes.length)) {
            if (aTab._tPos - i >= 0) {
                tab = tabs.childNodes[aTab._tPos - i];
                if (tab.getAttribute("multiselect") == "true") {
                    return tab;
                }
            }
            if (aTab._tPos + i < tabs.childNodes.length) {
                tab = tabs.childNodes[aTab._tPos + i];
                if (tab.getAttribute("multiselect") == "true") {
                    tab.setAttribute("multiselect-noclear", "true");
                    return tab;
                }
            }
            i++;
        }
        return null;
    },

    multiSpanSelect: function(aBeginTab, aEndTab) {
        this.clearMultiSelect();
        var tabs = document.getElementById("tabbrowser-tabs");
        var begin = aBeginTab._tPos;
        var end = aEndTab._tPos;
        if (begin > end) {
            [end, begin] = [begin, end];
        }
        for (let i=begin; i <= end; i++) {
            tabs.childNodes[i].setAttribute("multiselect", "true");
        }
    },

    clearMultiSelect: function() {
        var tabs = document.getElementById("tabbrowser-tabs");
        for (let i=0; i < tabs.childNodes.length; i++ ) {
            tabs.childNodes[i].removeAttribute("multiselect");
        }
    },

    /*** Event handlers ***/

    handleEvent: function(aEvent) {
        switch (aEvent.type) {
        case 'mousedown':
            this.onMouseDown(aEvent);
            return;
        case 'TabSelect':
            this.onTabSelect(aEvent);
            return;
        }
    },

    onMouseDown: function(aEvent) {
        if (aEvent.target.localName != "tab") {
            return;
        }
        if (aEvent.button != 0) {
            return;
        }

        // Check for Ctrl+click (multiselection).  On the Mac it's
        // Cmd+click which is represented by metaKey.  Ctrl+click won't be
        // possible on the Mac because that would be a right click (button 2)
        if (aEvent.ctrlKey || aEvent.metaKey) {
            this.toggleMultiSelect(aEvent.target);
            aEvent.stopPropagation();
        } else if (aEvent.shiftKey) {
            let tabs = document.getElementById("tabbrowser-tabs");
            this.multiSpanSelect(tabs.tabbrowser.selectedTab, aEvent.target);
            aEvent.stopPropagation();
        } else if (aEvent.target.selected) {
            // Clicking on the already selected tab won't fire a
            // TabSelect event, but we still want to deselect any
            // other tabs.
            this.clearMultiSelect();
        }
    },

    onTabSelect: function(aEvent) {
        if (aEvent.target.getAttribute("multiselect-noclear") == "true") {
            aEvent.target.removeAttribute("multiselect");
            aEvent.target.removeAttribute("multiselect-noclear");
            return;
        }
        this.clearMultiSelect();
    }

};
