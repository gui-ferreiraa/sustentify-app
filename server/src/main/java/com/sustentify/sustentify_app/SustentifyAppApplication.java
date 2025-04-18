package com.sustentify.sustentify_app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SustentifyAppApplication {

	public static void main(String[] args) {
//		Dotenv dotenv = Dotenv.configure().directory(".").ignoreIfMissing().load();
//		dotenv.entries().forEach(entry ->
//				System.setProperty(entry.getKey(), entry.getValue())
//		);

		SpringApplication.run(SustentifyAppApplication.class, args);
	}
}
