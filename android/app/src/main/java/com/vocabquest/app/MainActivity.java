package com.vocabquest.app;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(ExternalBrowserPlugin.class);
        super.onCreate(savedInstanceState);
    }

    @Override
    public void onStart() {
        super.onStart();
        if (bridge == null || bridge.getWebView() == null) return;
        bridge.getWebView().addJavascriptInterface(new NativeBridge(this), "VocabQuestNative");
    }

    void openExternalUrl(String url) {
        runOnUiThread(() -> {
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intent);
        });
    }

    static final class NativeBridge {
        private final MainActivity activity;

        NativeBridge(MainActivity activity) {
            this.activity = activity;
        }

        @JavascriptInterface
        public void openExternalUrl(String url) {
            if (url == null || url.isEmpty()) return;
            activity.openExternalUrl(url);
        }
    }
}
