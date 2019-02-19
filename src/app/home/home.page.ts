import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})
export class HomePage {

	toastIsShown = false;

	R: number = 0;
	G: number = 0;
	B: number = 0;

	X: number = 0;
	Y: number = 0;
	Z: number = 0;

	H: number = 0;
	L: number = 0;
	S: number = 0;

	rgbtxt: string;
	hlstxt: string;
	xyztxt: string;

	colorCode = 'rgb(0, 0, 0)';

	constructor(public toastController: ToastController) { }

	
	rChange(event: number) {
		this.R = event;
		this.triggerRGB();
	}

	gChange(event: number) {
		this.G = event;
		this.triggerRGB();
	}

	bChange(event: number) {
		this.B = event;
		this.triggerRGB();
	}

	private triggerRGB() {
		this.colorCode = 'rgb(' + this.R + ', ' + this.G + ', ' + this.B + ')';
		this.rgbToHsl(this.R, this.G, this.B);
		this.RGBtoXYZ();
	}
	

	xChange(event: number) {
		this.X = event;
		this.triggerXYZ();
	}

	yChange(event: number) {
		this.Y = event;
		this.triggerXYZ();
	}

	zChange(event: number) {
		this.Z = event;
		this.triggerXYZ();
	}

	private triggerXYZ() {
		this.XYZtoRGB();
		this.rgbToHsl(this.R, this.G, this.B);
		this.colorCode = 'rgb(' + this.R + ', ' + this.G + ', ' + this.B + ')';
	}


	hChange(event: number) {
		this.H = event;
		this.triggerHLS();		
	}

	lChange(event: number) {
		this.L = event;
		this.triggerHLS();
	}

	sChange(event: number) {
		this.S = event;
		this.triggerHLS();
	}

	private triggerHLS() {
		this.hslToRgb(this.H / 360, this.S / 100, this.L / 100);
		this.RGBtoXYZ();
	}


	setColorRGB(rgbToSet: string, r: number, g: number, b: number) {
		this.colorCode = rgbToSet;
		this.R = r;
		this.G = g;
		this.B = b;
		this.triggerRGB();
	}

	setColorHSL(hslToSet: string, h: number, s: number, l: number) {
		this.colorCode = hslToSet;
		this.H = h;
		this.L = l;
		this.S = s;
		this.triggerHLS();
	}


	getRGB() {
		const rgb = this.rgbtxt.split(";");
		this.R = Number(rgb[0]);
		this.G = Number(rgb[1]);
		this.B = Number(rgb[2]);
		this.triggerRGB();
	}

	getXYZ() {
		const xyz = this.xyztxt.split(";");
		this.X = Number(xyz[0]);
		this.Y = Number(xyz[1]);
		this.Z = Number(xyz[2]);
		this.triggerXYZ();
	}

	getHLS() {
		const hls = this.hlstxt.split(";");
		this.H = Number(hls[0]);
		this.L = Number(hls[1]);
		this.S = Number(hls[2]);
		this.triggerHLS();
	}


	RGBtoXYZ() {
		const Rn = this.RGBn(this.R);
		const Gn = this.RGBn(this.G);
		const Bn = this.RGBn(this.B);
		this.X = (0.412453 * Rn + 0.357580 * Gn + 0.180423 * Bn) / 100;
		this.Y = (0.212671 * Rn + 0.715160 * Gn + 0.072169 * Bn) / 100;
		this.Z = (0.019334 * Rn + 0.119193 * Gn + 0.950227 * Bn) / 100;
		if (this.X > 0.9504 || this.Y > 1 || this.Z > 1.0883) {
			this.presentToast();
		}
	}

	XYZtoRGB() {
		let Rn = this.X * 3.2406 + this.Y * -1.5372 + this.Z * -0.4986;
		let Gn = this.X * -0.9689 + this.Y * 1.8758 + this.Z * 0.0415;
		let Bn = this.X * 0.0557 + this.Y * -0.2040 + this.Z * 1.0570;

		if (Rn > 0.0031308) 
			Rn = 1.055 * Math.pow(Rn, (1 / 2.4)) - 0.055;
		else 
			Rn *= Rn;
		if (Gn > 0.0031308) 
			Gn = 1.055 * Math.pow(Gn, (1 / 2.4)) - 0.055;
		else 
			Gn *= Gn;
		if (Bn > 0.0031308) 
			Bn = 1.055 * Math.pow(Bn, (1 / 2.4)) - 0.055;
		else 
			Bn *= Bn;
		
		this.R = Rn * 255;
		this.G = Gn * 255;
		this.B = Bn * 255
		if (this.R > 255 || this.R < 0 || 
			this.G > 255 || this.G < 0 || 
			this.B > 255 || this.B < 0) {
			this.presentToast();
		}
	}

	private RGBn(x: number): number {
		const divided = x / 255;
		if (divided >= 0.04045) {
			return Math.pow((divided + 0.055) / 1.055, 2.4) * 100;
		} else {
			return (divided / 12.92) * 100;
		}
	}

	hue2rgb(p: number, q: number, t: number) {
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		if (t < 1 / 6) return p + (q - p) * 6 * t;
		if (t < 1 / 2) return q;
		if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
		return p;
	}

	hslToRgb(h: number, s: number, l: number) {
		var r: number, g: number, b: number;

		if (s == 0) {
			r = g = b = l;
		} else {
			var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			var p = 2 * l - q;
			r = this.hue2rgb(p, q, h + 1 / 3);
			g = this.hue2rgb(p, q, h);
			b = this.hue2rgb(p, q, h - 1 / 3);
		}

		this.R = Math.round(r * 255);
		this.G = Math.round(g * 255);
		this.B = Math.round(b * 255);
		this.colorCode = 'rgb(' + this.R + ', ' + this.G + ', ' + this.B + ')';
	}

	rgbToHsl(r: number, g: number, b: number) {
		r /= 255, g /= 255, b /= 255;
		var max = Math.max(r, g, b), min = Math.min(r, g, b);
		var h: number, s: number, l = (max + min) / 2;

		if (max == min) {
			h = s = 0;
		} else {
			var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch (max) {
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}
			h /= 6;
		}

		this.H = Math.round(h * 360);
		this.L = Math.round(l * 100);
		this.S = Math.round(s * 100);
	}

	async presentToast() {
		if (!this.toastIsShown) {
			this.toastIsShown = true;
			const toast = await this.toastController.create({
				message: 'Conversion is out of range.',
				duration: 1000
			});
			toast.present();
			setTimeout(() => {
				this.toastIsShown = false;
			}, 1500);
		}
	}
}
