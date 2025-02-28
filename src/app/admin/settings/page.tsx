"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteSettings } from "@/types";

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "Codifya E-Ticaret",
    siteDescription: "Modern ve kullanıcı dostu e-ticaret platformu",
    contactEmail: "info@codifya.com",
    contactPhone: "+90 555 123 4567",
    address: "Atatürk Cad. No:123, İstanbul, Türkiye",
    logo: "/logo.png",
    currency: "TRY",
    taxRate: 18,
    shippingFee: 29.99,
    freeShippingThreshold: 500,
    enableRegistration: true,
    enableGuestCheckout: true,
    maintenanceMode: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof SiteSettings
  ) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setSettings({ ...settings, [field]: value });
    }
  };

  const handleSwitchChange = (checked: boolean, field: keyof SiteSettings) => {
    setSettings({ ...settings, [field]: checked });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Burada API'ye ayarları kaydetme işlemi yapılacak
    alert("Ayarlar kaydedildi!");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Site Ayarları</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Genel Ayarlar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Adı</Label>
                  <Input
                    id="siteName"
                    name="siteName"
                    value={settings.siteName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo URL</Label>
                  <Input
                    id="logo"
                    name="logo"
                    value={settings.logo}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Açıklaması</Label>
                <Textarea
                  id="siteDescription"
                  name="siteDescription"
                  value={settings.siteDescription}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>İletişim Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">E-posta Adresi</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Telefon Numarası</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={settings.contactPhone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adres</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={settings.address}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ödeme ve Vergi Ayarları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Para Birimi</Label>
                  <Input
                    id="currency"
                    name="currency"
                    value={settings.currency}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">KDV Oranı (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={settings.taxRate}
                    onChange={(e) => handleNumberChange(e, "taxRate")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shippingFee">Kargo Ücreti (₺)</Label>
                  <Input
                    id="shippingFee"
                    type="number"
                    step="0.01"
                    value={settings.shippingFee}
                    onChange={(e) => handleNumberChange(e, "shippingFee")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="freeShippingThreshold">
                    Ücretsiz Kargo Limiti (₺)
                  </Label>
                  <Input
                    id="freeShippingThreshold"
                    type="number"
                    value={settings.freeShippingThreshold}
                    onChange={(e) =>
                      handleNumberChange(e, "freeShippingThreshold")
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sistem Ayarları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableRegistration">
                    Kullanıcı Kaydını Etkinleştir
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Yeni kullanıcıların siteye kayıt olmasına izin ver
                  </p>
                </div>
                <Switch
                  id="enableRegistration"
                  checked={settings.enableRegistration}
                  onCheckedChange={(checked: boolean) =>
                    handleSwitchChange(checked, "enableRegistration")
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableGuestCheckout">
                    Misafir Alışverişi Etkinleştir
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Kullanıcıların kayıt olmadan alışveriş yapmasına izin ver
                  </p>
                </div>
                <Switch
                  id="enableGuestCheckout"
                  checked={settings.enableGuestCheckout}
                  onCheckedChange={(checked: boolean) =>
                    handleSwitchChange(checked, "enableGuestCheckout")
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenanceMode">Bakım Modu</Label>
                  <p className="text-sm text-muted-foreground">
                    Siteyi bakım moduna al (sadece yöneticiler erişebilir)
                  </p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked: boolean) =>
                    handleSwitchChange(checked, "maintenanceMode")
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button type="submit">Ayarları Kaydet</Button>
        </div>
      </form>
    </div>
  );
} 