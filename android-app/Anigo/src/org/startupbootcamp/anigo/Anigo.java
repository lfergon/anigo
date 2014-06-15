/******************************************************************
 * Copyright (C) 2011-2014 HERE Global B.V.  All rights reserved. *
 ******************************************************************/

package org.startupbootcamp.anigo;

import java.util.*;

import java.io.IOException;

import android.app.Activity;
import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup.LayoutParams;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import org.startupbootcamp.anigo.R;

import com.here.android.mpa.ar.ARController;
import com.here.android.mpa.ar.ARController.Error;
import com.here.android.mpa.ar.ARIconObject;
import com.here.android.mpa.ar.CompositeFragment;
import com.here.android.mpa.common.GeoCoordinate;
import com.here.android.mpa.common.Image;
import com.here.android.mpa.common.OnEngineInitListener;
import com.here.android.mpa.mapping.Map;
import com.here.android.mpa.mapping.*;

public class Anigo extends Activity {

    // map embedded in the composite fragment
    private Map map;

    // composite fragment embedded in this activity
    private CompositeFragment compositeFragment;

    // ARController is a facade for controlling LiveSight behavior
    private ARController arController;

    // buttons which will allow the user to start LiveSight and add objects
    private Button startButton;
    private Button stopButton;
    
    private boolean onlyFailures;
    
    private ArrayList<ARIconObject> arObjectsGood = new ArrayList<ARIconObject>();
    private ArrayList<MapMarker> mapObjectsGood = new ArrayList<MapMarker>();
    
    private ArrayList<ARIconObject> arObjectsBad = new ArrayList<ARIconObject>();
    private ArrayList<MapMarker> mapObjectsBad = new ArrayList<MapMarker>();
    
    
    private double[][] center = {
    	{52.505724, 13.393276, 0.0}	
    };
    
    private double[][] coordGood = {
    		{52.505724, 13.393276, 2.0},
    		{52.501724, 13.394276, 2.0},
    		{52.502724, 13.396276, 2.0},
    		{52.507724, 13.398276, 2.0},
    		{52.500724, 13.390276, 2.0}
    };
    
    private String[][] textBad = {
    		{" Solar panel \n Id: 650 \n Type:1Soltech Reflection Series 60 Cell \n Distance: 24m \n Description: Broken "},
    };
    
    private String[][] textGood = {
    		{" Solar panel \n Id: 123 \n Type:1Soltech Reflection Series 60 Cell \n Distance: 124m \n Description: OK "},
    		{" Solar panel \n Id: 232 \n Type:1Soltech Reflection Series 60 Cell \n Distance: 132m \n Description: OK "},
    		{" Solar panel \n Id: 344 \n Type:1Soltech Reflection Series 60 Cell \n Distance: 504m \n Description: OK "},
    		{" Solar panel \n Id: 456 \n Type:1Soltech Reflection Series 60 Cell \n Distance: 104m \n Description: OK "},
    		{" Solar panel \n Id: 034 \n Type:1Soltech Reflection Series 60 Cell \n Distance: 3m \n Description: OK "},
    };
    
    private double[][] coordBad = {
    		{52.500724, 13.396476, 2.0},
    };
    
    private int coordGoodNum = 5;
    private int coordBadNum = 1;
    

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        onlyFailures = false;

        // Search for the composite fragment to finish setup by calling init().
        compositeFragment = (CompositeFragment) getFragmentManager().findFragmentById(R.id.compositefragment);
        compositeFragment.init(new OnEngineInitListener() {
            @Override
            public void onEngineInitializationCompleted(OnEngineInitListener.Error error) {
                if (error == OnEngineInitListener.Error.NONE) {
                    // retrieve a reference of the map from the composite fragment
                    map = compositeFragment.getMap();
                    // Set the map center coordinate to the Vancouver Downtown region (no animation)
                    map.setCenter(new GeoCoordinate(center[0][0],center[0][1],center[0][2]), Map.Animation.NONE);
                    // Set the map zoom level to the average between min and max (no animation)
                    map.setZoomLevel((map.getMaxZoomLevel() + map.getMinZoomLevel()) / 2);
                    // LiveSight setup should be done after fragment init is complete
                    setupLiveSight();
                } else {
                    System.out.println("ERROR: Cannot initialize Composite Fragment");
                }
            }
        });

        // hold references to the buttons for future use
        startButton = (Button) findViewById(R.id.startLiveSight);
        stopButton = (Button) findViewById(R.id.stopLiveSight);
        
    }

    private void setupLiveSight() {
        // ARController should not be used until fragment init has completed
        arController = compositeFragment.getARController();
        // tells LiveSight to display icons while viewing the map (pitch down)
        arController.setUseDownIconsOnMap(true);
        // tells LiveSight to use a static mock location instead of the devices GPS fix
        arController.setAlternativeCenter(new GeoCoordinate(center[0][0],center[0][1],center[0][2]));
    }

    public void startLiveSight(View view) {
        if (arController != null) {
            // triggers the transition from Map mode to LiveSight mode
            Error error = arController.start();
            map.setCenter(new GeoCoordinate(center[0][0],center[0][1],center[0][2]), Map.Animation.NONE);

            if (error == Error.NONE) {
                startButton.setVisibility(View.GONE);
                stopButton.setVisibility(View.VISIBLE);
            } else {
                Toast.makeText(getApplicationContext(),
                        "Error starting LiveSight: " + error.toString(), Toast.LENGTH_LONG);
            }
        }
        
        //objectsMapToAR();
        
        Button zoomAll = (Button) findViewById(R.id.zoomAll);
        zoomAll.setVisibility(View.INVISIBLE);
        
        TextView searchBar = (TextView) findViewById(R.id.searchText);
        searchBar.setVisibility(View.INVISIBLE);
    }

    public void stopLiveSight(View view) {
        if (arController != null) {
            // exits LiveSight mode and returns to Map mode with exit animation
            Error error = arController.stop(true);

            if (error == Error.NONE) {
                startButton.setVisibility(View.VISIBLE);
                stopButton.setVisibility(View.GONE);
            } else {
                Toast.makeText(getApplicationContext(),
                        "Error stopping LiveSight: " + error.toString(), Toast.LENGTH_LONG);
            }
        }
        
        //objectsARtoMap();
        Button zoomAll = (Button) findViewById(R.id.zoomAll);
        zoomAll.setVisibility(View.VISIBLE);
        
        TextView searchBar = (TextView) findViewById(R.id.searchText);
        searchBar.setVisibility(View.VISIBLE);
    }

    
    public void zoomToAll(View view){
    	addGoodMap();
    	addBadMap();
    	addGoodAR();
    	addBadAR();
    }
    
    
    private void objectsMapToAR(){
    	removeGoodMap();
    	removeBadMap();
    	addBadAR();
    	if(!onlyFailures) addGoodAR();
    }

    private void objectsARtoMap(){
    	removeGoodAR();
    	removeBadAR();
    	addBadMap();
    	if(!onlyFailures) addGoodMap();
    }

    
    
    private void addGoodAR(){
    	for(int i=0; i < coordGoodNum; i++){
			Image image = new Image();
			try {
				image.setImageResource(R.drawable.icon_ar_good);
			} catch (IOException e) {
				e.printStackTrace();
			}

			TextView view = new TextView(this);
			view.setText(textGood[i][0]);
			view.setBackgroundColor(Color.WHITE);
			view.setTextColor(Color.BLACK);
			
			LinearLayout.LayoutParams llp = new LinearLayout.LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT);
		    llp.setMargins(10, 0, 0, 0); // llp.setMargins(left, top, right, bottom);
		    view.setLayoutParams(llp);
			
			// creates a new icon object which uses the same image in up and down views
			ARIconObject arIconObject = new ARIconObject(new GeoCoordinate(coordGood[i][0],coordGood[i][1],coordGood[i][2]),
					(View) view, image);


			// adds the icon object to LiveSight to be rendered 
			arController.addARObject(arIconObject);
			arObjectsGood.add(arIconObject);
		}
    }
    
    private void addGoodMap(){
    	if (map != null) {
    	for(int i=0; i < coordGoodNum; i++){
    		Image image = new Image();
    		try {
    			image.setImageResource(R.drawable.icon_map_good);
    		} catch (IOException e) {
    			e.printStackTrace();
    		}

    		MapMarker marker = new MapMarker(new GeoCoordinate(coordGood[i][0],coordGood[i][1],coordGood[i][2]), image);
    		map.addMapObject(marker);
    		mapObjectsGood.add(marker);
    	}
    	}
    }
    
    private void addBadAR(){
    	for(int i=0; i < coordBadNum; i++){
			Image image = new Image();
			try {
				image.setImageResource(R.drawable.icon_ar_bad);
			} catch (IOException e) {
				e.printStackTrace();
			}
			
			TextView view = new TextView(this);
			view.setText(textBad[i][0]);
			view.setBackgroundColor(Color.WHITE);
			view.setTextColor(Color.BLACK);

			LinearLayout.LayoutParams llp = new LinearLayout.LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT);
		    llp.setMargins(10, 0, 0, 0); // llp.setMargins(left, top, right, bottom);
		    view.setLayoutParams(llp);
			
			// creates a new icon object which uses the same image in up and down views
			ARIconObject arIconObject = new ARIconObject(new GeoCoordinate(coordBad[i][0],coordBad[i][1],coordBad[i][2]),
					(View) view, image);


			// adds the icon object to LiveSight to be rendered 
			arController.addARObject(arIconObject);
			arObjectsBad.add(arIconObject);
		}
    }
    
    private void addBadMap(){
    	if (map != null) {
    	for(int i=0; i < coordBadNum; i++){
    		Image image = new Image();
    		try {
    			image.setImageResource(R.drawable.icon_map_bad);
    		} catch (IOException e) {
    			e.printStackTrace();
    		}

    		MapMarker marker = new MapMarker(new GeoCoordinate(coordBad[i][0],coordBad[i][1],coordBad[i][2]), image);
    		map.addMapObject(marker);
    		mapObjectsBad.add(marker);
    	}
    	}
    }
    
    private void removeGoodAR(){
    	if (arController != null) {
    		for(int i=0; i < arObjectsGood.size(); i++){
    			arController.removeARObject(arObjectsGood.get(i));
    		}
    	}
    }
    
    private void removeGoodMap(){
    	for(int i=0; i < mapObjectsGood.size(); i++){
    		map.removeMapObject(mapObjectsGood.get(i));
			mapObjectsGood.remove(mapObjectsGood.get(i));
		}
    }
    
    private void removeBadAR(){
    	if (arController != null) {
    		for(int i=0; i < arObjectsBad.size(); i++){
    			arController.removeARObject(arObjectsBad.get(i));
    		}
    	}
    }
    
    private void removeBadMap(){
    	for(int i=0; i < mapObjectsBad.size(); i++){
    		map.removeMapObject(mapObjectsBad.get(i));
			mapObjectsBad.remove(mapObjectsBad.get(i));
		}
    }
}
