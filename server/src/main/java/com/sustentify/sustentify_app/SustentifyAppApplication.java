package com.sustentify.sustentify_app;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.env.Environment;

import java.util.Arrays;

@SpringBootApplication
public class SustentifyAppApplication implements CommandLineRunner {

	private Environment environment;

	public SustentifyAppApplication(Environment environment) {
		this.environment = environment;
	}

	public static void main(String[] args) {
		SpringApplication.run(SustentifyAppApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		String[] profiles = environment.getActiveProfiles();
		System.out.println("Active Profiles: " + Arrays.toString(profiles));
	}
}
