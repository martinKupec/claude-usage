import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';

import { ExtensionPreferences, gettext as _ } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

import { readOAuthToken } from './credentials.js';

export default class ClaudeUsagePreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();

        const page = new Adw.PreferencesPage({
            title: 'Claude Usage',
            icon_name: 'dialog-information-symbolic',
        });
        window.add(page);

        // Credentials status group
        const credGroup = new Adw.PreferencesGroup({
            title: 'Authentication',
            description: 'Credentials are read automatically from ~/.claude/.credentials.json (created by Claude Code CLI)',
        });
        page.add(credGroup);

        const credStatus = this._credentialStatus();
        const credRow = new Adw.ActionRow({
            title: 'Credentials',
            subtitle: credStatus,
        });
        credRow.set_activatable(false);
        credGroup.add(credRow);

        // Settings group
        const settingsGroup = new Adw.PreferencesGroup({
            title: 'Settings',
        });
        page.add(settingsGroup);

        const updateIntervalRow = new Adw.SpinRow({
            title: 'Update Interval',
            subtitle: 'How often to fetch usage data (minutes)',
            adjustment: new Gtk.Adjustment({
                lower: 1,
                upper: 60,
                step_increment: 1,
                page_increment: 5,
                value: settings.get_int('update-interval'),
            }),
        });
        updateIntervalRow.connect('notify::value', () => {
            settings.set_int('update-interval', updateIntervalRow.get_value());
        });
        settingsGroup.add(updateIntervalRow);
    }

    _credentialStatus() {
        const token = readOAuthToken();
        return token
            ? 'Found — credentials loaded from Claude Code'
            : 'Not found — run `claude auth login` to authenticate Claude Code';
    }
}
