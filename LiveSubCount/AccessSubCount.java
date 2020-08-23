package WebProjects.LiveSubCount;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class AccessSubCount {

    public static void main(String[] args){
        executePost("https://counts.live/api/tiktok-follower-count/coolbrownperson/live");
    }

    public static String executePost(String targetURL){
        HttpURLConnection conn = null;

        try{
            URL url = new URL(targetURL);
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");

            conn.setRequestProperty("user-agent", "Mozilla/5.0");
            conn.setRequestProperty("sec-fetch-site", "Same-origin");
            conn.setRequestProperty("sec-fetch-mode", "cors");
            conn.setRequestProperty("sec-fetch-dest", "empty");
            conn.setRequestProperty("referer", "https://counts.live/tiktok-follower-count/coolbrownperson");
            conn.setRequestProperty("if-none-match", "W/\"aa-ylkbZkBkFHbq8AlU1r/P6U3PcIM\"");
            conn.setRequestProperty("dnt", "1");
            conn.setRequestProperty("accept-language", "en-US,en;q=0.9,te;q=0.8,fr;q=0.7");

            int responseCode = conn.getResponseCode();
            System.out.println("Sending Req to: " + url.toString());
            System.out.println("Response Code: " + responseCode);

            try (BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()))){
                StringBuilder resp = new StringBuilder();
                String line;

                while((line = in.readLine()) != null){
                    resp.append(line);
                }

                System.out.println(resp.toString());
                conn.disconnect();;

                return(resp.toString());
            }
        }
        catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }
}
