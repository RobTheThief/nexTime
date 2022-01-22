package com.robthethief.nextime;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class BootUpReceiver extends BroadcastReceiver {
@Override
public void onReceive(Context context, Intent intent) {
    if(intent.getAction() == Intent.ACTION_BOOT_COMPLETED){
    
        //log("Starting the service in < 26 Mode from a BroadcastReceiver")
        context.startService(new Intent(context, nexTimeService.class));
    }

}
}