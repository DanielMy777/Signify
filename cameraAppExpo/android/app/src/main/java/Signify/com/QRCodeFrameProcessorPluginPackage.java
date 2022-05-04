package Signify.com;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.mrousavy.camera.frameprocessor.FrameProcessorPlugin;

import java.util.Collections;
import java.util.List;

import javax.annotation.Nonnull;

public class QRCodeFrameProcessorPluginPackage implements ReactPackage {

  @Override
  public List<NativeModule> createNativeModules( ReactApplicationContext reactContext) {
    FrameProcessorPlugin.register(new QRCodeFrameProcessorPlugin(reactContext));
    return Collections.emptyList();
  }

  @Nonnull
  @Override
  public List<ViewManager> createViewManagers(@Nonnull ReactApplicationContext reactContext) {
    return Collections.emptyList();
  }
}