package com.yourappname;

import android.content.Intent;
import android.provider.Settings;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class SettingsModule extends ReactContextBaseJavaModule {

  SettingsModule(ReactApplicationContext context) {
    super(context);
  }

  @Override
  public String getName() {
    return "SettingsModule";
  }

  @ReactMethod
  public void openMobileDataSettings() {
    Intent intent = new Intent(Settings.ACTION_DATA_ROAMING_SETTINGS);
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    if (intent.resolveActivity(getReactApplicationContext().getPackageManager()) != null) {
      getReactApplicationContext().startActivity(intent);
    }
  }
}
