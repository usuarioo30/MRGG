package com.mrgg;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.mrgg.service.AdminService;

@SpringBootApplication
public class MrggApplication implements CommandLineRunner {

	@Autowired
	private AdminService adminService;

	public static void main(String[] args) {
		SpringApplication.run(MrggApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		adminService.adminPorDefecto();
	}

}
