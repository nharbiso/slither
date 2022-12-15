package edu.brown.cs32.orb;

import java.util.Random;

public abstract class OrbColor {

    

    public static String generate() {
        final String[] colors = { "ff0000", "24f51e", "221fdc", "811fdc", "1fd9dc", "ff6d00", "fdff00", "ff00b2" };
        Random random = new Random();

        return "#" + colors[random.nextInt(0, colors.length)];
    }
}
