package com.mrgg;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.mrgg.service.AdminService;
import com.mrgg.service.JuegoService;

@SpringBootApplication
public class MrggApplication implements CommandLineRunner {

	@Autowired
	private AdminService adminService;

	@Autowired
	private JuegoService juegoService;

	public static void main(String[] args) {
		SpringApplication.run(MrggApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		adminService.adminPorDefecto();
		juegoService.juegoPorDefecto();
	}

}
