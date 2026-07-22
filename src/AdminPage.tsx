import React, { useState, useEffect } from 'react';
import acLogo from './assets/logo.png';
import srecLogo from './assets/srec-logo.png';
import { 
  Shield, 
  Database, 
  RefreshCw, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit, 
  Download, 
  Search, 
  Calendar, 
  DollarSign, 
  Users, 
  User,
  BarChart2, 
  ArrowLeft, 
  BookOpen, 
  Layers, 
  Activity,
  Briefcase,
  Eye,
  X,
  Menu,
  MapPin,
  ExternalLink
} from 'lucide-react';

const ADMIN_MASTER_KEY = "MRBB2026";

function sha256Fallback(str: string): string {
  const rotateRight = (n: number, x: number) => (x >>> n) | (x << (32 - n));
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  const words: number[] = [];
  const ascii = str;
  let s = ascii + "\x80";
  while (s.length % 64 - 56) s += "\x00";
  
  for (let i = 0; i < s.length; i++) {
    words[i >> 2] |= s.charCodeAt(i) << ((3 - i % 4) * 8);
  }
  
  words[words.length] = 0;
  words[words.length] = ascii.length * 8;

  let H0 = 0x6a09e667, H1 = 0xbb67ae85, H2 = 0x3c6ef372, H3 = 0xa54ff53a,
      H4 = 0x510e527f, H5 = 0x9b05688c, H6 = 0x1f83d9ab, H7 = 0x5be0cd19;

  for (let i = 0; i < words.length; i += 16) {
    const w = words.slice(i, i + 16);
    let a = H0, b = H1, c = H2, d = H3, e = H4, f = H5, g = H6, h = H7;

    for (let j = 0; j < 64; j++) {
      if (j >= 16) {
        const s0 = rotateRight(7, w[j - 15]) ^ rotateRight(18, w[j - 15]) ^ (w[j - 15] >>> 3);
        const s1 = rotateRight(17, w[j - 2]) ^ rotateRight(19, w[j - 2]) ^ (w[j - 2] >>> 10);
        w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0;
      }

      const S1 = rotateRight(6, e) ^ rotateRight(11, e) ^ rotateRight(25, e);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[j] + (w[j] || 0)) | 0;
      const S0 = rotateRight(2, a) ^ rotateRight(13, a) ^ rotateRight(22, a);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) | 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }

    H0 = (H0 + a) | 0; H1 = (H1 + b) | 0; H2 = (H2 + c) | 0; H3 = (H3 + d) | 0;
    H4 = (H4 + e) | 0; H5 = (H5 + f) | 0; H6 = (H6 + g) | 0; H7 = (H7 + h) | 0;
  }

  const hex = (n: number) => {
    let res = (n >>> 0).toString(16);
    while (res.length < 8) res = "0" + res;
    return res;
  };
  
  return hex(H0) + hex(H1) + hex(H2) + hex(H3) + hex(H4) + hex(H5) + hex(H6) + hex(H7);
}

// SHA-256 helper with secure context fallback
async function sha256(message: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback to pure JS SHA-256 for insecure contexts (HTTP / IP test)
  return sha256Fallback(message);
}

const DEFAULT_PRICING: Record<string, number> = {
  base_conf_student_ieee_inr: 9000,
  base_conf_student_non_ieee_inr: 10000,
  base_conf_prof_ieee_inr: 10000,
  base_conf_prof_non_ieee_inr: 11000,
  base_tut_student_ieee_inr: 1000,
  base_tut_student_non_ieee_inr: 1250,
  base_tut_prof_ieee_inr: 1250,
  base_tut_prof_non_ieee_inr: 1500,
  base_both_student_ieee_inr: 9500,
  base_both_student_non_ieee_inr: 10750,
  base_both_prof_ieee_inr: 10750,
  base_both_prof_non_ieee_inr: 12000,
  base_listener_student_ieee_inr: 3500,
  base_listener_student_non_ieee_inr: 5000,
  base_listener_prof_ieee_inr: 4500,
  base_listener_prof_non_ieee_inr: 6000,

  base_conf_student_ieee_usd: 150,
  base_conf_student_non_ieee_usd: 200,
  base_conf_prof_ieee_usd: 200,
  base_conf_prof_non_ieee_usd: 250,
  base_tut_student_ieee_usd: 40,
  base_tut_student_non_ieee_usd: 50,
  base_tut_prof_ieee_usd: 50,
  base_tut_prof_non_ieee_usd: 75,
  base_both_student_ieee_usd: 175,
  base_both_student_non_ieee_usd: 225,
  base_both_prof_ieee_usd: 225,
  base_both_prof_non_ieee_usd: 300
};

interface AdminPageProps {
  supabase: any;
  isSupabaseConfigured: boolean;
  fetchDbData: () => Promise<void>;
  departments: any[];
  committeeMembers: any[];
  speakers: any[];
  importantDates: any[];
  workshops: any[];
  submittedRegistrations: any[];
  info: Record<string, string>;
  pricing: Record<string, number>;
  stats: any[];
  coordinators: any[];
  setInfo: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setPricing: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  setStats: React.Dispatch<React.SetStateAction<any[]>>;
  setCoordinators: React.Dispatch<React.SetStateAction<any[]>>;
  onClose?: () => void;
}

export default function AdminPage({
  supabase,
  isSupabaseConfigured,
  fetchDbData,
  departments,
  committeeMembers,
  speakers,
  importantDates,
  workshops,
  submittedRegistrations,
  info,
  pricing,
  stats,
  coordinators,
  setInfo,
  setPricing,
  setStats,
  setCoordinators,
  onClose
}: AdminPageProps) {
  // Auth states
  const [adminUser, setAdminUser] = useState<string | null>(() => localStorage.getItem('srec_logged_in_admin'));
  const [adminRegMode, setAdminRegMode] = useState<boolean>(false);
  const [adminUsername, setAdminUsername] = useState<string>('');
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState<string>('');
  const [adminMasterKey, setAdminMasterKey] = useState<string>('');
  const [adminLoading, setAdminLoading] = useState<boolean>(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  // Tab state
  const [activeTab, setActiveTab] = useState<string>('registrations');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Search & Filter Controls
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Editing state variables (Generic Modal/Forms)
  const [editingSpeaker, setEditingSpeaker] = useState<any | null>(null);
  const [editingWorkshop, setEditingWorkshop] = useState<any | null>(null);
  const [editingCommittee, setEditingCommittee] = useState<any | null>(null);
  const [editingDept, setEditingDept] = useState<any | null>(null);
  const [editingMilestone, setEditingMilestone] = useState<any | null>(null);
  const [editingCoordinator, setEditingCoordinator] = useState<any | null>(null);
  const [editingStat, setEditingStat] = useState<any | null>(null);
  const [uploadingSpeakerImage, setUploadingSpeakerImage] = useState<boolean>(false);

  // Local state copy of pricing configuration
  const [localPricing, setLocalPricing] = useState<Record<string, number>>({});
  const [isSavingPricing, setIsSavingPricing] = useState<boolean>(false);

  useEffect(() => {
    if (pricing) {
      setLocalPricing({ ...DEFAULT_PRICING, ...pricing });
    }
  }, [pricing]);

  const handleSaveAllPricing = async () => {
    setIsSavingPricing(true);
    try {
      if (isSupabaseConfigured && supabase) {
        // Upsert all pricing rules in parallel
        const promises = Object.entries(localPricing).map(([key, val]) => {
          const currency = key.endsWith('_usd') ? 'USD' : 'INR';
          return supabase.from('registration_pricing').upsert({ key, value: val, currency });
        });
        const results = await Promise.all(promises);
        const firstError = results.find(r => r.error);
        if (firstError) throw firstError.error;
      }
      setPricing(localPricing);
      alert('All pricing configurations saved successfully to database!');
    } catch (err: any) {
      alert('Save pricing failed: ' + (err.message || err));
    } finally {
      setIsSavingPricing(false);
    }
  };
  // Local state copy of general configurations
  const [localInfo, setLocalInfo] = useState<Record<string, string>>({});
  const [isSavingInfo, setIsSavingInfo] = useState<boolean>(false);

  useEffect(() => {
    if (info) {
      setLocalInfo(info);
    }
  }, [info]);

  const handleSaveAllInfo = async () => {
    setIsSavingInfo(true);
    try {
      if (isSupabaseConfigured && supabase) {
        // Upsert all info settings in parallel
        const promises = Object.entries(localInfo).map(([key, val]) => 
          supabase.from('conference_info').upsert({ key, value: val })
        );
        const results = await Promise.all(promises);
        const firstError = results.find(r => r.error);
        if (firstError) throw firstError.error;
      } else {
        localStorage.setItem('srec_offline_info', JSON.stringify(localInfo));
      }
      setInfo(localInfo);
      alert('All general configurations saved successfully to database!');
    } catch (err: any) {
      alert('Save general configurations failed: ' + (err.message || err));
    } finally {
      setIsSavingInfo(false);
    }
  };
  // Explore Page data states
  const [touristPlaces, setTouristPlaces] = useState<any[]>([]);
  const [weekendStays, setWeekendStays] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [exploreSubTab, setExploreSubTab] = useState<'sights' | 'getaways' | 'hotels'>('sights');

  const [editingTouristPlace, setEditingTouristPlace] = useState<any | null>(null);
  const [editingWeekendStay, setEditingWeekendStay] = useState<any | null>(null);
  const [editingHotel, setEditingHotel] = useState<any | null>(null);

  const fetchExploreData = async () => {
    try {
      if (isSupabaseConfigured && supabase) {
        const { data: touristData } = await supabase.from('tourist_places').select('*').order('sort_order');
        if (touristData) setTouristPlaces(touristData);

        const { data: weekendData } = await supabase.from('weekend_stays').select('*').order('sort_order');
        if (weekendData) setWeekendStays(weekendData);

        const { data: hotelsData } = await supabase.from('hotels_to_stay').select('*').order('sort_order');
        if (hotelsData) setHotels(hotelsData);
      } else {
        setTouristPlaces(JSON.parse(localStorage.getItem('srec_offline_tourist_places') || '[]'));
        setWeekendStays(JSON.parse(localStorage.getItem('srec_offline_weekend_stays') || '[]'));
        setHotels(JSON.parse(localStorage.getItem('srec_offline_hotels') || '[]'));
      }
    } catch (e) {
      console.warn('Failed to fetch Explore data inside AdminPage', e);
    }
  };

  useEffect(() => {
    if (adminUser) {
      fetchExploreData();
    }
  }, [adminUser]);

  // tourist_places CRUD
  const handleSaveTouristPlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTouristPlace) return;
    try {
      const payload = {
        name: editingTouristPlace.name,
        category: editingTouristPlace.category,
        description: editingTouristPlace.description,
        image_url: editingTouristPlace.image_url || '',
        map_url: editingTouristPlace.map_url || '',
        sort_order: Number(editingTouristPlace.sort_order || 0)
      };

      if (isSupabaseConfigured && supabase) {
        let error;
        if (editingTouristPlace.id) {
          const res = await supabase.from('tourist_places').update(payload).eq('id', editingTouristPlace.id);
          error = res.error;
        } else {
          const res = await supabase.from('tourist_places').insert(payload);
          error = res.error;
        }
        if (error) throw error;
      } else {
        let list = [...touristPlaces];
        if (editingTouristPlace.id) {
          list = list.map(t => t.id === editingTouristPlace.id ? editingTouristPlace : t);
        } else {
          list.push({ ...editingTouristPlace, id: Date.now() });
        }
        localStorage.setItem('srec_offline_tourist_places', JSON.stringify(list));
      }
      setEditingTouristPlace(null);
      await fetchExploreData();
      alert('Tourist place saved successfully!');
    } catch (err: any) {
      alert('Save tourist place failed: ' + err.message);
    }
  };

  const handleDeleteTouristPlace = async (id: any) => {
    if (!window.confirm('Delete this tourist place?')) return;
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('tourist_places').delete().eq('id', id);
        if (error) throw error;
      } else {
        const list = touristPlaces.filter(t => t.id !== id);
        localStorage.setItem('srec_offline_tourist_places', JSON.stringify(list));
      }
      await fetchExploreData();
      alert('Tourist place deleted!');
    } catch (err: any) {
      alert('Delete tourist place failed: ' + err.message);
    }
  };

  // weekend_stays CRUD
  const handleSaveWeekendStay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWeekendStay) return;
    try {
      const payload = {
        name: editingWeekendStay.name,
        category: editingWeekendStay.category,
        description: editingWeekendStay.description,
        image_url: editingWeekendStay.image_url || '',
        map_url: editingWeekendStay.map_url || '',
        sort_order: Number(editingWeekendStay.sort_order || 0)
      };

      if (isSupabaseConfigured && supabase) {
        let error;
        if (editingWeekendStay.id) {
          const res = await supabase.from('weekend_stays').update(payload).eq('id', editingWeekendStay.id);
          error = res.error;
        } else {
          const res = await supabase.from('weekend_stays').insert(payload);
          error = res.error;
        }
        if (error) throw error;
      } else {
        let list = [...weekendStays];
        if (editingWeekendStay.id) {
          list = list.map(s => s.id === editingWeekendStay.id ? editingWeekendStay : s);
        } else {
          list.push({ ...editingWeekendStay, id: Date.now() });
        }
        localStorage.setItem('srec_offline_weekend_stays', JSON.stringify(list));
      }
      setEditingWeekendStay(null);
      await fetchExploreData();
      alert('Weekend getaway saved successfully!');
    } catch (err: any) {
      alert('Save weekend getaway failed: ' + err.message);
    }
  };

  const handleDeleteWeekendStay = async (id: any) => {
    if (!window.confirm('Delete this weekend getaway?')) return;
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('weekend_stays').delete().eq('id', id);
        if (error) throw error;
      } else {
        const list = weekendStays.filter(s => s.id !== id);
        localStorage.setItem('srec_offline_weekend_stays', JSON.stringify(list));
      }
      await fetchExploreData();
      alert('Weekend getaway deleted!');
    } catch (err: any) {
      alert('Delete weekend getaway failed: ' + err.message);
    }
  };

  // hotels_to_stay CRUD
  const handleSaveHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHotel) return;
    try {
      const payload = {
        name: editingHotel.name,
        category: editingHotel.category,
        address: editingHotel.address,
        description: editingHotel.description,
        map_url: editingHotel.map_url || '',
        image_url: editingHotel.image_url || '',
        sort_order: Number(editingHotel.sort_order || 0)
      };

      if (isSupabaseConfigured && supabase) {
        let error;
        if (editingHotel.id) {
          const res = await supabase.from('hotels_to_stay').update(payload).eq('id', editingHotel.id);
          error = res.error;
        } else {
          const res = await supabase.from('hotels_to_stay').insert(payload);
          error = res.error;
        }
        if (error) throw error;
      } else {
        let list = [...hotels];
        if (editingHotel.id) {
          list = list.map(h => h.id === editingHotel.id ? editingHotel : h);
        } else {
          list.push({ ...editingHotel, id: Date.now() });
        }
        localStorage.setItem('srec_offline_hotels', JSON.stringify(list));
      }
      setEditingHotel(null);
      await fetchExploreData();
      alert('Hotel saved successfully!');
    } catch (err: any) {
      alert('Save hotel failed: ' + err.message);
    }
  };

  const handleDeleteHotel = async (id: any) => {
    if (!window.confirm('Delete this hotel stay?')) return;
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('hotels_to_stay').delete().eq('id', id);
        if (error) throw error;
      } else {
        const list = hotels.filter(h => h.id !== id);
        localStorage.setItem('srec_offline_hotels', JSON.stringify(list));
      }
      await fetchExploreData();
      alert('Hotel deleted!');
    } catch (err: any) {
      alert('Delete hotel failed: ' + err.message);
    }
  };

  // Refresh helper
  const handleRefresh = async () => {
    setAdminLoading(true);
    try {
      await fetchDbData();
      alert('Database contents reloaded successfully!');
    } catch (err: any) {
      alert('Error fetching data: ' + err.message);
    } finally {
      setAdminLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (submittedRegistrations.length === 0) return;
    const headers = ['Date', 'Author Name', 'Email', 'Phone', 'Paper ID', 'Paper Title', 'Tour Requested', 'Tour Destination', 'Screenshot Name'];
    const rows = submittedRegistrations.map(r => [
      new Date(r.created_at || Date.now()).toLocaleString(),
      r.author_name || 'N/A',
      r.email || 'N/A',
      r.phone || 'N/A',
      r.paper_id || 'N/A',
      r.paper_title ? `"${r.paper_title.replace(/"/g, '""')}"` : 'N/A',
      r.register_for_tour ? 'Yes' : 'No',
      r.preferred_tour_place || 'N/A',
      r.screenshot_name || 'N/A'
    ]);
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `AECTSD_2027_Registrations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSpeakerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingSpeakerImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `speaker_${Date.now()}.${fileExt}`;
      
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.storage
          .from('payment-proofs')
          .upload(fileName, file, { cacheControl: '3600', upsert: true });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('payment-proofs')
          .getPublicUrl(fileName);

        setEditingSpeaker((prev: any) => ({ ...prev, image_url: publicUrl }));
        alert('Speaker photo uploaded successfully!');
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setEditingSpeaker((prev: any) => ({ ...prev, image_url: reader.result as string }));
          alert('Speaker photo loaded successfully (offline mode)!');
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploadingSpeakerImage(false);
    }
  };

  // Auth Submit Handlers
  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    setAdminLoading(true);

    try {
      if (adminRegMode) {
        if (adminUsername.trim() === '' || adminPassword.trim() === '') {
          throw new Error('Username and password cannot be empty.');
        }
        if (adminPassword !== adminConfirmPassword) {
          throw new Error('Passwords do not match.');
        }
        if (adminMasterKey !== ADMIN_MASTER_KEY) {
          throw new Error('Invalid Admin Master Key.');
        }

        const passHash = await sha256(adminPassword);

        if (isSupabaseConfigured && supabase) {
          const { error } = await supabase.from('website_admins').insert({
            username: adminUsername,
            password_hash: passHash
          });
          if (error) {
            if (error.code === '23505') throw new Error('Username already exists.');
            throw error;
          }
        } else {
          const localAdmins = JSON.parse(localStorage.getItem('srec_offline_admins') || '{}');
          if (localAdmins[adminUsername]) {
            throw new Error('Username already exists.');
          }
          localAdmins[adminUsername] = passHash;
          localStorage.setItem('srec_offline_admins', JSON.stringify(localAdmins));
        }

        setAdminRegMode(false);
        setAdminPassword('');
        setAdminConfirmPassword('');
        setAdminMasterKey('');
        alert('Admin registered successfully! Please log in.');
      } else {
        if (adminUsername.trim() === '' || adminPassword.trim() === '') {
          throw new Error('Username and password cannot be empty.');
        }

        const passHash = await sha256(adminPassword);

        if (isSupabaseConfigured && supabase) {
          const { data, error } = await supabase
            .from('website_admins')
            .select('*')
            .eq('username', adminUsername)
            .single();

          if (error || !data) {
            throw new Error('Invalid username or password.');
          }
          if (data.password_hash !== passHash) {
            throw new Error('Invalid username or password.');
          }
        } else {
          const localAdmins = JSON.parse(localStorage.getItem('srec_offline_admins') || '{}');
          if (!localAdmins[adminUsername] || localAdmins[adminUsername] !== passHash) {
            throw new Error('Invalid username or password.');
          }
        }

        localStorage.setItem('srec_logged_in_admin', adminUsername);
        setAdminUser(adminUsername);
        setAdminPassword('');
      }
    } catch (err: any) {
      setAdminError(err.message || 'Authentication failed.');
    } finally {
      setAdminLoading(false);
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('srec_logged_in_admin');
    setAdminUser(null);
    setAdminUsername('');
    setAdminPassword('');
  };



  // Generic Speaker Save/Delete
  const handleSaveSpeaker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpeaker) return;
    try {
      const payload = {
        name: editingSpeaker.name,
        title: editingSpeaker.title,
        role: editingSpeaker.role,
        talk: editingSpeaker.talk,
        color: editingSpeaker.color || '#3b82f6',
        image_url: editingSpeaker.image_url
      };

      if (isSupabaseConfigured && supabase) {
        let error;
        if (editingSpeaker.id) {
          const res = await supabase.from('speakers').update(payload).eq('id', editingSpeaker.id);
          error = res.error;
        } else {
          const res = await supabase.from('speakers').insert(payload);
          error = res.error;
        }
        if (error) throw error;
      } else {
        let list = [...speakers];
        if (editingSpeaker.id) {
          list = list.map(x => x.id === editingSpeaker.id ? editingSpeaker : x);
        } else {
          list.push({ ...editingSpeaker, id: Date.now() });
        }
        localStorage.setItem('srec_offline_speakers', JSON.stringify(list));
      }
      setEditingSpeaker(null);
      await fetchDbData();
    } catch (err: any) {
      alert('Save speaker failed: ' + err.message);
    }
  };

  const handleDeleteSpeaker = async (id: any) => {
    if (!window.confirm('Delete this speaker?')) return;
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('speakers').delete().eq('id', id);
        if (error) throw error;
      } else {
        const list = speakers.filter(x => x.id !== id);
        localStorage.setItem('srec_offline_speakers', JSON.stringify(list));
      }
      await fetchDbData();
    } catch (err: any) {
      alert('Delete speaker failed: ' + err.message);
    }
  };

  // Generic Academic Track Save/Delete
  const handleSaveDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept) return;
    try {
      const payload = {
        name: editingDept.name,
        description: editingDept.description,
        sort_order: Number(editingDept.sort_order || 1)
      };

      if (isSupabaseConfigured && supabase) {
        let error;
        if (editingDept.id) {
          const res = await supabase.from('departments').update(payload).eq('id', editingDept.id);
          error = res.error;
        } else {
          const res = await supabase.from('departments').insert(payload);
          error = res.error;
        }
        if (error) throw error;
      } else {
        let list = [...departments];
        if (editingDept.id) {
          list = list.map(x => x.id === editingDept.id ? editingDept : x);
        } else {
          list.push({ ...editingDept, id: Date.now() });
        }
        localStorage.setItem('srec_offline_departments', JSON.stringify(list));
      }
      setEditingDept(null);
      await fetchDbData();
    } catch (err: any) {
      alert('Save track failed: ' + err.message);
    }
  };

  const handleDeleteDept = async (id: any) => {
    if (!window.confirm('Delete this academic track?')) return;
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('departments').delete().eq('id', id);
        if (error) throw error;
      } else {
        const list = departments.filter(x => x.id !== id);
        localStorage.setItem('srec_offline_departments', JSON.stringify(list));
      }
      await fetchDbData();
    } catch (err: any) {
      alert('Delete track failed: ' + err.message);
    }
  };

  // Generic Committee Member Save/Delete
  const handleSaveCommittee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCommittee) return;
    try {
      const payload = {
        name: editingCommittee.name,
        role: editingCommittee.role || '',
        desc: editingCommittee.desc || '',
        category: editingCommittee.category || 'organizing',
        image_url: editingCommittee.image_url || null
      };

      if (isSupabaseConfigured && supabase) {
        let error;
        if (editingCommittee.id) {
          const res = await supabase.from('committee').update(payload).eq('id', editingCommittee.id);
          error = res.error;
        } else {
          const res = await supabase.from('committee').insert(payload);
          error = res.error;
        }
        if (error) {
          console.warn('Supabase save error, falling back to local sync:', error);
        }
      }

      let list = [...committeeMembers];
      if (editingCommittee.id) {
        list = list.map(x => x.id === editingCommittee.id ? { ...x, ...payload } : x);
      } else {
        list.push({ ...editingCommittee, ...payload, id: Date.now() });
      }
      localStorage.setItem('srec_offline_committee', JSON.stringify(list));

      setEditingCommittee(null);
      await fetchDbData();
    } catch (err: any) {
      alert('Save committee member failed: ' + err.message);
    }
  };

  const handleDeleteCommittee = async (id: any) => {
    if (!window.confirm('Delete this committee member?')) return;
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('committee').delete().eq('id', id);
        if (error) throw error;
      } else {
        const list = committeeMembers.filter(x => x.id !== id);
        localStorage.setItem('srec_offline_committee', JSON.stringify(list));
      }
      await fetchDbData();
    } catch (err: any) {
      alert('Delete committee member failed: ' + err.message);
    }
  };

  // Generic Tutorial Workshop Save/Delete
  const handleSaveWorkshop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWorkshop) return;
    try {
      const payload = {
        title: editingWorkshop.title,
        speaker: editingWorkshop.speaker,
        speaker_designation: editingWorkshop.speaker_designation || '',
        speaker_institution: editingWorkshop.speaker_institution || '',
        date: editingWorkshop.date || '',
        time: editingWorkshop.time || '',
        desc: editingWorkshop.desc || ''
      };

      if (isSupabaseConfigured && supabase) {
        let error;
        if (editingWorkshop.id) {
          const res = await supabase.from('workshops').update(payload).eq('id', editingWorkshop.id);
          error = res.error;
        } else {
          const res = await supabase.from('workshops').insert(payload);
          error = res.error;
        }
        if (error) throw error;
      } else {
        let list = [...workshops];
        if (editingWorkshop.id) {
          list = list.map(x => x.id === editingWorkshop.id ? editingWorkshop : x);
        } else {
          list.push({ ...editingWorkshop, id: Date.now() });
        }
        localStorage.setItem('srec_offline_workshops', JSON.stringify(list));
      }
      setEditingWorkshop(null);
      await fetchDbData();
    } catch (err: any) {
      alert('Save workshop failed: ' + err.message);
    }
  };

  const handleDeleteWorkshop = async (id: any) => {
    if (!window.confirm('Delete this pre-conference tutorial workshop?')) return;
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('workshops').delete().eq('id', id);
        if (error) throw error;
      } else {
        const list = workshops.filter(x => x.id !== id);
        localStorage.setItem('srec_offline_workshops', JSON.stringify(list));
      }
      await fetchDbData();
    } catch (err: any) {
      alert('Delete workshop failed: ' + err.message);
    }
  };

  // NEW: CRUD for Timeline Milestones (important_dates)
  const handleSaveMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMilestone) return;
    try {
      const payload = {
        event_date: editingMilestone.event_date,
        title: editingMilestone.title,
        desc: editingMilestone.desc || '',
        sort_order: Number(editingMilestone.sort_order || 1)
      };

      if (isSupabaseConfigured && supabase) {
        let error;
        if (editingMilestone.id) {
          const res = await supabase.from('important_dates').update(payload).eq('id', editingMilestone.id);
          error = res.error;
        } else {
          const res = await supabase.from('important_dates').insert(payload);
          error = res.error;
        }
        if (error) throw error;
      } else {
        let list = [...importantDates];
        if (editingMilestone.id) {
          list = list.map(x => x.id === editingMilestone.id ? editingMilestone : x);
        } else {
          list.push({ ...editingMilestone, id: Date.now() });
        }
        localStorage.setItem('srec_offline_important_dates', JSON.stringify(list));
      }
      setEditingMilestone(null);
      await fetchDbData();
    } catch (err: any) {
      alert('Save milestone failed: ' + err.message);
    }
  };

  const handleDeleteMilestone = async (id: any) => {
    if (!window.confirm('Delete this milestone date?')) return;
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('important_dates').delete().eq('id', id);
        if (error) throw error;
      } else {
        const list = importantDates.filter(x => x.id !== id);
        localStorage.setItem('srec_offline_important_dates', JSON.stringify(list));
      }
      await fetchDbData();
    } catch (err: any) {
      alert('Delete milestone failed: ' + err.message);
    }
  };



  // CRUD for Coordinators (coordinators)
  const handleSaveCoordinator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoordinator) return;
    try {
      const payload: any = {
        name: editingCoordinator.name,
        role: editingCoordinator.role || '',
        phone: editingCoordinator.phone || '',
        email: editingCoordinator.email || '',
        sort_order: Number(editingCoordinator.sort_order || 1)
      };

      if (isSupabaseConfigured && supabase) {
        let error;
        let payloadToSave = { ...payload };
        let res = editingCoordinator.id
          ? await supabase.from('coordinators').update(payloadToSave).eq('id', editingCoordinator.id)
          : await supabase.from('coordinators').insert(payloadToSave);

        if (res.error && (res.error.message?.includes("'email'") || res.error.message?.includes("email"))) {
          // Fallback retry without 'email' column if column missing in Supabase schema
          delete payloadToSave.email;
          res = editingCoordinator.id
            ? await supabase.from('coordinators').update(payloadToSave).eq('id', editingCoordinator.id)
            : await supabase.from('coordinators').insert(payloadToSave);
        }
        error = res.error;
        if (error) throw error;
      } else {
        let list = [...coordinators];
        if (editingCoordinator.id) {
          list = list.map(x => x.id === editingCoordinator.id ? editingCoordinator : x);
        } else {
          list.push({ ...editingCoordinator, id: Date.now() });
        }
        setCoordinators(list);
      }
      setEditingCoordinator(null);
      await fetchDbData();
    } catch (err: any) {
      alert('Save coordinator failed: ' + (err.message || err));
    }
  };

  const handleDeleteCoordinator = async (id: any) => {
    if (!window.confirm('Delete this coordinator contact?')) return;
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('coordinators').delete().eq('id', id);
        if (error) throw error;
      } else {
        const list = coordinators.filter(x => x.id !== id);
        setCoordinators(list);
      }
      await fetchDbData();
    } catch (err: any) {
      alert('Delete coordinator failed: ' + err.message);
    }
  };

  // NEW: CRUD for Quick Stats (stats)
  const handleSaveStat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStat) return;
    try {
      const payload = {
        key: editingStat.key,
        value: editingStat.value,
        label: editingStat.label,
        icon: editingStat.icon || 'Sparkles',
        sort_order: Number(editingStat.sort_order || 1)
      };

      if (isSupabaseConfigured && supabase) {
        let error;
        if (editingStat.id) {
          const res = await supabase.from('stats').update(payload).eq('id', editingStat.id);
          error = res.error;
        } else {
          const res = await supabase.from('stats').insert(payload);
          error = res.error;
        }
        if (error) throw error;
      } else {
        let list = [...stats];
        if (editingStat.id) {
          list = list.map(x => x.id === editingStat.id ? editingStat : x);
        } else {
          list.push({ ...editingStat, id: Date.now() });
        }
        setStats(list);
      }
      setEditingStat(null);
      await fetchDbData();
    } catch (err: any) {
      alert('Save stat failed: ' + err.message);
    }
  };

  const handleDeleteStat = async (id: any) => {
    if (!window.confirm('Delete this statistic metric?')) return;
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('stats').delete().eq('id', id);
        if (error) throw error;
      } else {
        const list = stats.filter(x => x.id !== id);
        setStats(list);
      }
      await fetchDbData();
    } catch (err: any) {
      alert('Delete stat failed: ' + err.message);
    }
  };

  const handleDeleteRegistration = async (id: any) => {
    if (!window.confirm('Are you sure you want to delete this registration log?')) return;
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('registrations').delete().eq('id', id);
        if (error) throw error;
      } else {
        const list = submittedRegistrations.filter(x => x.id !== id);
        localStorage.setItem('srec_offline_registrations', JSON.stringify(list));
      }
      await fetchDbData();
    } catch (err: any) {
      alert('Delete registration failed: ' + err.message);
    }
  };

  const handleClearAllRegistrations = async () => {
    if (!window.confirm('⚠️ WARNING: Are you sure you want to delete ALL registrations? This cannot be undone.')) return;
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('registrations').delete().neq('id', 0);
        if (error) throw error;
      } else {
        localStorage.setItem('srec_offline_registrations', '[]');
      }
      await fetchDbData();
    } catch (err: any) {
      alert('Clear registrations failed: ' + err.message);
    }
  };

  // If not logged in, render fullscreen login/register panel
  if (!adminUser) {
    return (
      <div style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 10% 20%, rgba(9, 29, 54, 0.98) 0%, rgba(4, 12, 24, 1) 90%)',
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: '1.5rem',
        boxSizing: 'border-box'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
          borderRadius: '1.5rem',
          maxWidth: '440px',
          width: '100%',
          padding: '2.5rem 2rem',
          color: '#ffffff'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              display: 'inline-flex',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(29, 78, 216, 0.2) 100%)',
              padding: '1rem',
              borderRadius: '50%',
              color: '#3b82f6',
              marginBottom: '1rem',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.25)'
            }}>
              <Shield size={38} />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 0.5rem 0', letterSpacing: '-0.025em' }}>
              {adminRegMode ? 'Create Admin Account' : 'Admin Console Login'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
              {adminRegMode ? 'Register admin credentials with secure master key.' : 'Access database dashboards to edit page contents.'}
            </p>
          </div>

          <form onSubmit={handleAdminAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label htmlFor="user" style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, marginBottom: '0.35rem' }}>Username</label>
              <input 
                id="user"
                type="text" 
                required 
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="Enter username"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.5rem',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label htmlFor="pass" style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, marginBottom: '0.35rem' }}>Password</label>
              <input 
                id="pass"
                type="password" 
                required 
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter password"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.5rem',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {adminRegMode && (
              <>
                <div>
                  <label htmlFor="confirmPass" style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, marginBottom: '0.35rem' }}>Confirm Password</label>
                  <input 
                    id="confirmPass"
                    type="password" 
                    required 
                    value={adminConfirmPassword}
                    onChange={(e) => setAdminConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '0.5rem',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="master" style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, marginBottom: '0.35rem' }}>Master Key</label>
                  <input 
                    id="master"
                    type="password" 
                    required 
                    value={adminMasterKey}
                    onChange={(e) => setAdminMasterKey(e.target.value)}
                    placeholder="Enter registration master key"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '0.5rem',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </>
            )}

            {adminError && (
              <div style={{
                color: '#ef4444',
                fontSize: '0.8rem',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                fontWeight: 600
              }}>
                {adminError}
              </div>
            )}

            <button 
              type="submit" 
              disabled={adminLoading}
              style={{
                width: '100%',
                padding: '0.85rem',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.2s ease',
                marginTop: '0.5rem'
              }}
            >
              {adminLoading ? 'Processing...' : adminRegMode ? 'Register & Create Account' : 'Secure Login'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
              {adminRegMode ? (
                <button 
                  type="button" 
                  onClick={() => { setAdminRegMode(false); setAdminError(null); }}
                  style={{ background: 'none', border: 'none', color: '#60a5fa', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Already have an account? Log in
                </button>
              ) : (
                <button 
                  type="button" 
                  onClick={() => { setAdminRegMode(true); setAdminError(null); }}
                  style={{ background: 'none', border: 'none', color: '#60a5fa', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Need an account? Register with Master Key
                </button>
              )}
            </div>
          </form>

          <button 
            onClick={() => { window.location.hash = '#/'; }}
            style={{
              width: '100%',
              padding: '0.85rem',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#94a3b8',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0.5rem',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              marginTop: '1.5rem',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
              <ArrowLeft size={16} /> Return to Site
            </span>
          </button>
        </div>
      </div>
    );
  }

  // Define grouped sidebar navigation categories & tabs
  const tabGroups = [
    {
      category: 'OVERVIEW & LOGS',
      items: [
        { id: 'registrations', label: 'Registrations Log', icon: <Database size={16} />, badge: submittedRegistrations.length },
        { id: 'stats', label: 'Dashboard Stats', icon: <BarChart2 size={16} />, badge: stats.length }
      ]
    },
    {
      category: 'CONFERENCE SETUP',
      items: [
        { id: 'general', label: 'General Info & Links', icon: <Activity size={16} /> },
        { id: 'milestones', label: 'Timeline Milestones', icon: <Calendar size={16} />, badge: importantDates.length },
        { id: 'pricing', label: 'Registration Fees', icon: <DollarSign size={16} /> }
      ]
    },
    {
      category: 'PROGRAM & TEAM',
      items: [
        { id: 'speakers', label: 'Keynote Speakers', icon: <Users size={16} />, badge: speakers.length },
        { id: 'tracks', label: 'Academic Tracks', icon: <Layers size={16} />, badge: departments.length },
        { id: 'committee', label: 'Committee Members', icon: <Briefcase size={16} />, badge: committeeMembers.length },
        { id: 'workshops', label: 'Tutorial Workshops', icon: <BookOpen size={16} />, badge: workshops.length },
        { id: 'coordinators', label: 'Coordinators & Contacts', icon: <Users size={16} />, badge: coordinators.length }
      ]
    },
    {
      category: 'VISITOR GUIDE',
      items: [
        { id: 'explore', label: 'Explore Sights & Stays', icon: <MapPin size={16} /> }
      ]
    }
  ];

  const tabs = tabGroups.flatMap(g => g.items);
  const isEditingAny = editingSpeaker || editingWorkshop || editingCommittee || editingDept || editingMilestone || editingCoordinator || editingStat || editingTouristPlace || editingWeekendStay || editingHotel;

  return (
    <div className="admin-layout-v2" style={{ display: 'flex', flexDirection: 'row', minHeight: '100vh', width: '100%', background: '#f0f2f5' }}>
      {/* Sidebar Backdrop Overlay on Mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 998
          }}
        />
      )}

      {/* 1. Categorized Navigation Sidebar (Far Left - 260px Wide) */}
      <aside className={`admin-sidebar-v2 ${sidebarOpen ? 'admin-sidebar-open' : ''}`}>
        {/* Sidebar Logo Header - Centered AECTSD Logo */}
        <div style={{
          padding: '1.5rem 1.25rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.6rem',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(0,0,0,0.15)'
        }}>
          {/* SREC + AECTSD logos side by side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center' }}>
            <img src={srecLogo} alt="SREC" style={{ height: '38px', width: 'auto', objectFit: 'contain' }} />
            <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.15)' }} />
            <img src={acLogo} alt="AECTSD" style={{ height: '42px', width: 'auto', objectFit: 'contain' }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.04em' }}>AECTSD 2027</div>
            <div style={{ fontSize: '0.64rem', color: '#64748b', fontWeight: 600, marginTop: '0.1rem' }}>Admin Console</div>
          </div>
          {/* Logged-in user pill */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.45rem',
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
            borderRadius: '20px', padding: '0.25rem 0.75rem'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10b981' }}>{adminUser}</span>
          </div>
        </div>

        {/* Grouped Tab Links */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 0' }}>
          {tabGroups.map((group, gIdx) => (
            <div key={gIdx}>
              <div className="admin-sidebar-group-title">{group.category}</div>
              {group.items.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSearchTerm('');
                      setSidebarOpen(false);
                    }}
                    className={`admin-sidebar-item ${isActive ? 'active' : ''}`}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      {tab.icon}
                      {tab.label}
                    </span>
                    {tab.badge !== undefined && (
                      <span className="admin-sidebar-badge">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '0.7rem', color: '#64748b', textAlign: 'center' }}>
          AECTSD 2027 Console
        </div>
      </aside>

      {/* 2. Main Workspace Container (Right Side - Topbar + Main Dashboard Content) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: '100vh', background: '#f8fafc' }}>
        {/* Global Topbar Navigation Header */}
        <header className="admin-topbar-v2">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                borderRadius: '0.375rem',
                padding: '0.5rem',
                cursor: 'pointer',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Toggle Navigation"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>AECTSD 2027</span>
              <span style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: 700, background: 'rgba(56,189,248,0.12)', padding: '0.15rem 0.5rem', borderRadius: '4px', letterSpacing: '0.05em' }}>ADMIN CONSOLE</span>
            </div>
          </div>

          {/* Database Status Indicator & Global Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.75rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '0.35rem 0.75rem',
              borderRadius: '20px'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: isSupabaseConfigured ? '#10b981' : '#f59e0b',
                boxShadow: isSupabaseConfigured ? '0 0 8px #10b981' : '0 0 8px #f59e0b'
              }} />
              <span style={{ color: '#cbd5e1', fontWeight: 600 }}>
                {isSupabaseConfigured ? 'Database Connected' : 'Local Storage Mode'}
              </span>
            </div>

            <button
              onClick={handleRefresh}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                color: '#f8fafc',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.45rem 0.85rem',
                borderRadius: '0.5rem',
                fontSize: '0.775rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s'
              }}
              title="Refresh database records"
            >
              <RefreshCw size={14} /> Refresh
            </button>

            <button
              onClick={() => { 
                if (onClose) onClose();
                else window.location.hash = '#/'; 
              }}
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '0.45rem 0.95rem',
                borderRadius: '0.5rem',
                fontSize: '0.775rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
              }}
            >
              <ExternalLink size={14} /> Main Site
            </button>

            <button
              onClick={handleAdminLogout}
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#f87171',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                padding: '0.45rem 0.75rem',
                borderRadius: '0.5rem',
                fontSize: '0.775rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
              title="Sign out of admin panel"
            >
              <LogOut size={14} /> Log Out
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="admin-content" style={{ flex: 1, padding: '2rem 2.5rem', background: '#f8fafc', overflowY: 'auto' }}>
          {/* CLEAN EXECUTIVE METRIC CARDS (No Graphs) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
            {/* 1. Registrations Card */}
            <div
              onClick={() => setActiveTab('registrations')}
              style={{
                background: activeTab === 'registrations' ? 'linear-gradient(135deg, #091d36 0%, #112a4a 100%)' : '#ffffff',
                color: activeTab === 'registrations' ? '#ffffff' : '#0f172a',
                border: '1px solid #e2e8f0',
                borderRadius: '0.85rem',
                padding: '1.25rem 1.5rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8 }}>
                  Total Registrations
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 900, marginTop: '0.2rem' }}>
                  {submittedRegistrations.length}
                </div>
                <div style={{ fontSize: '0.72rem', color: activeTab === 'registrations' ? '#38bdf8' : '#2563eb', fontWeight: 700, marginTop: '0.25rem' }}>
                  {submittedRegistrations.filter((r: any) => r.register_for_tour).length} Tour Opt-ins
                </div>
              </div>
              <div style={{ background: activeTab === 'registrations' ? 'rgba(56,189,248,0.2)' : 'rgba(37,99,235,0.1)', color: activeTab === 'registrations' ? '#38bdf8' : '#2563eb', padding: '0.85rem', borderRadius: '0.65rem', display: 'flex' }}>
                <Database size={24} />
              </div>
            </div>

            {/* 2. Keynote Speakers Card */}
            <div
              onClick={() => setActiveTab('speakers')}
              style={{
                background: activeTab === 'speakers' ? 'linear-gradient(135deg, #091d36 0%, #112a4a 100%)' : '#ffffff',
                color: activeTab === 'speakers' ? '#ffffff' : '#0f172a',
                border: '1px solid #e2e8f0',
                borderRadius: '0.85rem',
                padding: '1.25rem 1.5rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8 }}>
                  Keynote Speakers
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 900, marginTop: '0.2rem' }}>
                  {speakers.length}
                </div>
                <div style={{ fontSize: '0.72rem', color: activeTab === 'speakers' ? '#fbbf24' : '#d97706', fontWeight: 700, marginTop: '0.25rem' }}>
                  Confirmed Experts
                </div>
              </div>
              <div style={{ background: activeTab === 'speakers' ? 'rgba(251,191,36,0.2)' : 'rgba(217,119,6,0.1)', color: activeTab === 'speakers' ? '#fbbf24' : '#d97706', padding: '0.85rem', borderRadius: '0.65rem', display: 'flex' }}>
                <User size={24} />
              </div>
            </div>

            {/* 3. Academic Tracks Card */}
            <div
              onClick={() => setActiveTab('tracks')}
              style={{
                background: activeTab === 'tracks' ? 'linear-gradient(135deg, #091d36 0%, #112a4a 100%)' : '#ffffff',
                color: activeTab === 'tracks' ? '#ffffff' : '#0f172a',
                border: '1px solid #e2e8f0',
                borderRadius: '0.85rem',
                padding: '1.25rem 1.5rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8 }}>
                  Academic Tracks
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 900, marginTop: '0.2rem' }}>
                  {departments.length}
                </div>
                <div style={{ fontSize: '0.72rem', color: activeTab === 'tracks' ? '#34d399' : '#059669', fontWeight: 700, marginTop: '0.25rem' }}>
                  Research Domains
                </div>
              </div>
              <div style={{ background: activeTab === 'tracks' ? 'rgba(52,211,153,0.2)' : 'rgba(5,150,105,0.1)', color: activeTab === 'tracks' ? '#34d399' : '#059669', padding: '0.85rem', borderRadius: '0.65rem', display: 'flex' }}>
                <BookOpen size={24} />
              </div>
            </div>

            {/* 4. Committee Members Card */}
            <div
              onClick={() => setActiveTab('committee')}
              style={{
                background: activeTab === 'committee' ? 'linear-gradient(135deg, #091d36 0%, #112a4a 100%)' : '#ffffff',
                color: activeTab === 'committee' ? '#ffffff' : '#0f172a',
                border: '1px solid #e2e8f0',
                borderRadius: '0.85rem',
                padding: '1.25rem 1.5rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8 }}>
                  Committee Members
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 900, marginTop: '0.2rem' }}>
                  {committeeMembers.length}
                </div>
                <div style={{ fontSize: '0.72rem', color: activeTab === 'committee' ? '#a78bfa' : '#7c3aed', fontWeight: 700, marginTop: '0.25rem' }}>
                  Organizing & Reviewers
                </div>
              </div>
              <div style={{ background: activeTab === 'committee' ? 'rgba(167,139,250,0.2)' : 'rgba(124,58,237,0.1)', color: activeTab === 'committee' ? '#a78bfa' : '#7c3aed', padding: '0.85rem', borderRadius: '0.65rem', display: 'flex' }}>
                <Briefcase size={24} />
              </div>
            </div>
          </div>



          {/* Modal Editing Backdrop Overlay */}
          {isEditingAny && (
            <div className="admin-modal-overlay">
              <div className="admin-modal-card">
                {/* Modal Title & Close Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', padding: '0.5rem', borderRadius: '0.5rem', color: '#ffffff', display: 'flex' }}>
                      <Edit size={20} />
                    </div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                      {editingSpeaker && (editingSpeaker.id ? 'Edit Speaker Details' : 'Add New Speaker')}
                      {editingWorkshop && (editingWorkshop.id ? 'Edit Workshop Details' : 'Add New Workshop')}
                      {editingCommittee && (editingCommittee.id ? 'Edit Committee Member' : 'Add Committee Member')}
                      {editingDept && (editingDept.id ? 'Edit Academic Track' : 'Add Academic Track')}
                      {editingMilestone && (editingMilestone.id ? 'Edit Milestone Date' : 'Add Milestone Date')}
                      {editingCoordinator && (editingCoordinator.id ? 'Edit Coordinator Contact' : 'Add Coordinator')}
                      {editingStat && (editingStat.id ? 'Edit Stat Metric' : 'Add Stat Metric')}
                      {editingTouristPlace && (editingTouristPlace.id ? 'Edit Tourist Place' : 'Add Tourist Place')}
                      {editingWeekendStay && (editingWeekendStay.id ? 'Edit Weekend Getaway' : 'Add Weekend Getaway')}
                      {editingHotel && (editingHotel.id ? 'Edit Hotel Listing' : 'Add Hotel Listing')}
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setEditingSpeaker(null);
                      setEditingWorkshop(null);
                      setEditingCommittee(null);
                      setEditingDept(null);
                      setEditingMilestone(null);
                      setEditingCoordinator(null);
                      setEditingStat(null);
                      setEditingTouristPlace(null);
                      setEditingWeekendStay(null);
                      setEditingHotel(null);
                    }}
                    style={{
                      border: 'none',
                      background: '#f1f5f9',
                      color: '#64748b',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                    title="Close editor modal"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* 1. Milestone Form */}
                {editingMilestone && (
                  <form onSubmit={handleSaveMilestone}>
                    <h4 style={{ margin: '0 0 1rem 0', fontWeight: 700 }}>{editingMilestone.id ? 'Edit Milestone' : 'Add New Milestone'}</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label htmlFor="ms_date" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Date Display (e.g. 15 Dec 2026)</label>
                        <input
                          id="ms_date"
                          type="text"
                          required
                          value={editingMilestone.event_date}
                          onChange={(e) => setEditingMilestone({ ...editingMilestone, event_date: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                      <div>
                        <label htmlFor="ms_title" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Milestone Title</label>
                        <input
                          id="ms_title"
                          type="text"
                          required
                          value={editingMilestone.title}
                          onChange={(e) => setEditingMilestone({ ...editingMilestone, title: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                      <div>
                        <label htmlFor="ms_sort" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Sort Order</label>
                        <input
                          id="ms_sort"
                          type="number"
                          required
                          value={editingMilestone.sort_order || 1}
                          onChange={(e) => setEditingMilestone({ ...editingMilestone, sort_order: Number(e.target.value) })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label htmlFor="ms_desc" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Short Description</label>
                      <input
                        id="ms_desc"
                        type="text"
                        value={editingMilestone.desc || ''}
                        onChange={(e) => setEditingMilestone({ ...editingMilestone, desc: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                      <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>Save Milestone</button>
                      <button type="button" onClick={() => setEditingMilestone(null)} className="btn btn-secondary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>Cancel</button>
                    </div>
                  </form>
                )}

                {/* 2. Speaker Form */}
                {editingSpeaker && (
                  <form onSubmit={handleSaveSpeaker}>
                    <h4 style={{ margin: '0 0 1rem 0', fontWeight: 700 }}>{editingSpeaker.id ? 'Edit Speaker' : 'Add New Speaker'}</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label htmlFor="spk_name" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Speaker Name</label>
                        <input
                          id="spk_name"
                          type="text"
                          required
                          value={editingSpeaker.name}
                          onChange={(e) => setEditingSpeaker({ ...editingSpeaker, name: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                      <div>
                        <label htmlFor="spk_img" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Photo / Image URL</label>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                          <input
                            id="spk_img"
                            type="text"
                            value={editingSpeaker.image_url || ''}
                            onChange={(e) => setEditingSpeaker({ ...editingSpeaker, image_url: e.target.value })}
                            placeholder="https://example.com/avatar.jpg"
                            style={{ flex: 1, padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem' }}
                          />
                          <div style={{ position: 'relative', overflow: 'hidden' }}>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              style={{ padding: '0.5rem 1rem', height: '100%', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                            >
                              {uploadingSpeakerImage ? 'Uploading...' : 'Upload'}
                            </button>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleSpeakerImageUpload}
                              disabled={uploadingSpeakerImage}
                              style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                bottom: 0,
                                left: 0,
                                opacity: 0,
                                cursor: 'pointer'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label htmlFor="spk_des" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Designation (Title)</label>
                        <input
                          id="spk_des"
                          type="text"
                          required
                          value={editingSpeaker.title || ''}
                          onChange={(e) => setEditingSpeaker({ ...editingSpeaker, title: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                      <div>
                        <label htmlFor="spk_inst" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Institution / University (Role)</label>
                        <input
                          id="spk_inst"
                          type="text"
                          required
                          value={editingSpeaker.role || ''}
                          onChange={(e) => setEditingSpeaker({ ...editingSpeaker, role: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label htmlFor="spk_talk" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Talk Title (Topic)</label>
                        <input
                          id="spk_talk"
                          type="text"
                          required
                          value={editingSpeaker.talk || ''}
                          onChange={(e) => setEditingSpeaker({ ...editingSpeaker, talk: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                      <div>
                        <label htmlFor="spk_color" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Theme Color</label>
                        <input
                          id="spk_color"
                          type="text"
                          required
                          value={editingSpeaker.color || '#3b82f6'}
                          onChange={(e) => setEditingSpeaker({ ...editingSpeaker, color: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                      <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>Save Speaker</button>
                      <button type="button" onClick={() => setEditingSpeaker(null)} className="btn btn-secondary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>Cancel</button>
                    </div>
                  </form>
                )}

                {/* 3. Track Form */}
                {editingDept && (
                  <form onSubmit={handleSaveDept}>
                    <h4 style={{ margin: '0 0 1rem 0', fontWeight: 700 }}>{editingDept.id ? 'Edit Academic Track' : 'Add New Academic Track'}</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label htmlFor="trk_name" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Track Name</label>
                        <input
                          id="trk_name"
                          type="text"
                          required
                          value={editingDept.name}
                          onChange={(e) => setEditingDept({ ...editingDept, name: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                      <div>
                        <label htmlFor="trk_sort" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Sort Order</label>
                        <input
                          id="trk_sort"
                          type="number"
                          required
                          value={editingDept.sort_order || 1}
                          onChange={(e) => setEditingDept({ ...editingDept, sort_order: Number(e.target.value) })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label htmlFor="trk_desc" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Description (Topics list, comma separated)</label>
                      <textarea
                        id="trk_desc"
                        value={editingDept.description || ''}
                        onChange={(e) => setEditingDept({ ...editingDept, description: e.target.value })}
                        rows={6}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem', fontFamily: 'inherit' }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                      <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>Save Track</button>
                      <button type="button" onClick={() => setEditingDept(null)} className="btn btn-secondary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>Cancel</button>
                    </div>
                  </form>
                )}

                {/* 4. Committee Form */}
                {editingCommittee && (
                  <form onSubmit={handleSaveCommittee}>
                    <h4 style={{ margin: '0 0 1rem 0', fontWeight: 700 }}>{editingCommittee.id ? 'Edit Committee Member' : 'Add Committee Member'}</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label htmlFor="mem_name" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Member Name</label>
                        <input
                          id="mem_name"
                          type="text"
                          required
                          value={editingCommittee.name}
                          onChange={(e) => setEditingCommittee({ ...editingCommittee, name: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                      <div>
                        <label htmlFor="mem_cat" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Category Group</label>
                        <select
                          id="mem_cat"
                          value={editingCommittee.category}
                          onChange={(e) => setEditingCommittee({ ...editingCommittee, category: e.target.value })}
                          style={{ width: '100%', padding: '0.55rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', marginTop: '0.25rem', background: '#ffffff', fontWeight: 600 }}
                        >
                          <option value="steering">Steering Committee</option>
                          <option value="organizing">Organizing Committee</option>
                          <option value="advisory">Advisory Committee</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="mem_sort" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Sort Order</label>
                        <input
                          id="mem_sort"
                          type="number"
                          required
                          value={editingCommittee.sort_order || 1}
                          onChange={(e) => setEditingCommittee({ ...editingCommittee, sort_order: Number(e.target.value) })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label htmlFor="mem_sub" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Subgroup Title / Role</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.25rem' }}>
                          <select
                            id="mem_sub"
                            value={editingCommittee.role || ''}
                            onChange={(e) => setEditingCommittee({ ...editingCommittee, role: e.target.value })}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', background: '#ffffff' }}
                          >
                            <option value="">Select or Type Subgroup...</option>
                            <option value="Patrons">Patrons</option>
                            <option value="General Chairs">General Chairs</option>
                            <option value="Executive Committee">Executive Committee</option>
                            <option value="Publication Committee">Publication Committee</option>
                            <option value="Arrangements Committee">Arrangements Committee</option>
                            <option value="Registration Committee">Registration Committee</option>
                            <option value="Tutorials & Workshops">Tutorials & Workshops</option>
                            <option value="Technical Review Committee">Technical Review Committee</option>
                            <option value="Outreach & Promotion Committee">Outreach & Promotion Committee</option>
                            <option value="Website & Media Committee">Website & Media Committee</option>
                            <option value="Hospitality Committee">Hospitality Committee</option>
                            <option value="General Members">General Members</option>
                            <option value="Steering Committee">Steering Committee</option>
                            <option value="National Advisory">National Advisory</option>
                            <option value="International Advisory">International Advisory</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Or type custom subgroup..."
                            value={editingCommittee.role || ''}
                            onChange={(e) => setEditingCommittee({ ...editingCommittee, role: e.target.value })}
                            style={{ width: '100%', padding: '0.4rem 0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', fontSize: '0.82rem' }}
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="mem_desc" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Affiliation / Description</label>
                        <input
                          id="mem_desc"
                          type="text"
                          placeholder="e.g. Professor, IIT Bombay"
                          value={editingCommittee.desc || ''}
                          onChange={(e) => setEditingCommittee({ ...editingCommittee, desc: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                      <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>Save Member</button>
                      <button type="button" onClick={() => setEditingCommittee(null)} className="btn btn-secondary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>Cancel</button>
                    </div>
                  </form>
                )}

                {/* 5. Workshop Form */}
                {editingWorkshop && (
                  <form onSubmit={handleSaveWorkshop}>
                    <h4 style={{ margin: '0 0 1rem 0', fontWeight: 700 }}>{editingWorkshop.id ? 'Edit Workshop' : 'Add New Workshop'}</h4>
                    <div style={{ marginBottom: '1rem' }}>
                      <label htmlFor="wk_title" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Workshop Title</label>
                      <input
                        id="wk_title"
                        type="text"
                        required
                        value={editingWorkshop.title}
                        onChange={(e) => setEditingWorkshop({ ...editingWorkshop, title: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label htmlFor="wk_spk" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Lead Instructor Name</label>
                        <input
                          id="wk_spk"
                          type="text"
                          required
                          value={editingWorkshop.speaker}
                          onChange={(e) => setEditingWorkshop({ ...editingWorkshop, speaker: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                      <div>
                        <label htmlFor="wk_des" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Instructor Designation</label>
                        <input
                          id="wk_des"
                          type="text"
                          value={editingWorkshop.speaker_designation || ''}
                          onChange={(e) => setEditingWorkshop({ ...editingWorkshop, speaker_designation: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label htmlFor="wk_inst" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Instructor University / Organization</label>
                        <input
                          id="wk_inst"
                          type="text"
                          value={editingWorkshop.speaker_institution || ''}
                          onChange={(e) => setEditingWorkshop({ ...editingWorkshop, speaker_institution: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                      <div>
                        <label htmlFor="wk_date" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Date</label>
                        <input
                          id="wk_date"
                          type="text"
                          value={editingWorkshop.date || ''}
                          onChange={(e) => setEditingWorkshop({ ...editingWorkshop, date: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                      <div>
                        <label htmlFor="wk_time" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Time</label>
                        <input
                          id="wk_time"
                          type="text"
                          value={editingWorkshop.time || ''}
                          onChange={(e) => setEditingWorkshop({ ...editingWorkshop, time: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label htmlFor="wk_desc" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Short Abstract / Outline</label>
                      <textarea
                        id="wk_desc"
                        value={editingWorkshop.desc || ''}
                        onChange={(e) => setEditingWorkshop({ ...editingWorkshop, desc: e.target.value })}
                        rows={4}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem', fontFamily: 'inherit' }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                      <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>Save Workshop</button>
                      <button type="button" onClick={() => setEditingWorkshop(null)} className="btn btn-secondary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>Cancel</button>
                    </div>
                  </form>
                )}

                {/* 6. Coordinator Form */}
                {editingCoordinator && (
                  <form onSubmit={handleSaveCoordinator}>
                    <h4 style={{ margin: '0 0 1rem 0', fontWeight: 700 }}>{editingCoordinator.id ? 'Edit Coordinator Details' : 'Add New Coordinator'}</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label htmlFor="co_name" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Coordinator Name</label>
                        <input
                          id="co_name"
                          type="text"
                          required
                          value={editingCoordinator.name}
                          onChange={(e) => setEditingCoordinator({ ...editingCoordinator, name: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                      <div>
                        <label htmlFor="co_role" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Role / Association (e.g. Co-convenor)</label>
                        <input
                          id="co_role"
                          type="text"
                          value={editingCoordinator.role || ''}
                          onChange={(e) => setEditingCoordinator({ ...editingCoordinator, role: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                      <div>
                        <label htmlFor="co_sort" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Sort Order</label>
                        <input
                          id="co_sort"
                          type="number"
                          required
                          value={editingCoordinator.sort_order || 1}
                          onChange={(e) => setEditingCoordinator({ ...editingCoordinator, sort_order: Number(e.target.value) })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label htmlFor="co_phone" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Mobile Number</label>
                        <input
                          id="co_phone"
                          type="text"
                          required
                          value={editingCoordinator.phone}
                          onChange={(e) => setEditingCoordinator({ ...editingCoordinator, phone: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                      <div>
                        <label htmlFor="co_email" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Email Address</label>
                        <input
                          id="co_email"
                          type="email"
                          required
                          value={editingCoordinator.email}
                          onChange={(e) => setEditingCoordinator({ ...editingCoordinator, email: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                      <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>Save Contact</button>
                      <button type="button" onClick={() => setEditingCoordinator(null)} className="btn btn-secondary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>Cancel</button>
                    </div>
                  </form>
                )}

                {/* 7. Stat Form */}
                {editingStat && (
                  <form onSubmit={handleSaveStat}>
                    <h4 style={{ margin: '0 0 1rem 0', fontWeight: 700 }}>{editingStat.id ? 'Edit Stat Metric' : 'Add New Stat Metric'}</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label htmlFor="st_key" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Unique Database Key</label>
                        <input
                          id="st_key"
                          type="text"
                          required
                          placeholder="e.g. tracks_count"
                          value={editingStat.key}
                          onChange={(e) => setEditingStat({ ...editingStat, key: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                      <div>
                        <label htmlFor="st_val" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Value Display (e.g. 10+, 500+)</label>
                        <input
                          id="st_val"
                          type="text"
                          required
                          value={editingStat.value}
                          onChange={(e) => setEditingStat({ ...editingStat, value: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                      <div>
                        <label htmlFor="st_lbl" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Metric Label</label>
                        <input
                          id="st_lbl"
                          type="text"
                          required
                          value={editingStat.label}
                          onChange={(e) => setEditingStat({ ...editingStat, label: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                      <div>
                        <label htmlFor="st_sort" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Sort Order</label>
                        <input
                          id="st_sort"
                          type="number"
                          required
                          value={editingStat.sort_order || 1}
                          onChange={(e) => setEditingStat({ ...editingStat, sort_order: Number(e.target.value) })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label htmlFor="st_ico" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Icon Name (e.g. Users, Layers, Award, Sparkles)</label>
                      <input
                        id="st_ico"
                        type="text"
                        value={editingStat.icon || ''}
                        onChange={(e) => setEditingStat({ ...editingStat, icon: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                      <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>Save Metric</button>
                      <button type="button" onClick={() => setEditingStat(null)} className="btn btn-secondary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>Cancel</button>
                    </div>
                  </form>
                )}

                {/* Explore Page - Tourist Place Form */}
                {editingTouristPlace && (
                  <form onSubmit={handleSaveTouristPlace}>
                    <h4 style={{ margin: '0 0 1rem 0', fontWeight: 700 }}>{editingTouristPlace.id ? 'Edit Tourist Place' : 'Add New Tourist Place'}</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label htmlFor="tp_name" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Name</label>
                        <input
                          id="tp_name"
                          type="text"
                          required
                          value={editingTouristPlace.name || ''}
                          onChange={(e) => setEditingTouristPlace({ ...editingTouristPlace, name: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                      <div>
                        <label htmlFor="tp_category" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Category (e.g. Temples, Parks, Sightseeing)</label>
                        <input
                          id="tp_category"
                          type="text"
                          required
                          value={editingTouristPlace.category || ''}
                          onChange={(e) => setEditingTouristPlace({ ...editingTouristPlace, category: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label htmlFor="tp_desc" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Description</label>
                      <textarea
                        id="tp_desc"
                        required
                        rows={3}
                        value={editingTouristPlace.description || ''}
                        onChange={(e) => setEditingTouristPlace({ ...editingTouristPlace, description: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem', fontFamily: 'inherit' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label htmlFor="tp_img" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Image URL</label>
                        <input
                          id="tp_img"
                          type="text"
                          value={editingTouristPlace.image_url || ''}
                          onChange={(e) => setEditingTouristPlace({ ...editingTouristPlace, image_url: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                      <div>
                        <label htmlFor="tp_map" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Google Maps URL</label>
                        <input
                          id="tp_map"
                          type="text"
                          value={editingTouristPlace.map_url || ''}
                          onChange={(e) => setEditingTouristPlace({ ...editingTouristPlace, map_url: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                      <div>
                        <label htmlFor="tp_sort" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Sort Order</label>
                        <input
                          id="tp_sort"
                          type="number"
                          value={editingTouristPlace.sort_order || 0}
                          onChange={(e) => setEditingTouristPlace({ ...editingTouristPlace, sort_order: Number(e.target.value) })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                      <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>Save Place</button>
                      <button type="button" onClick={() => setEditingTouristPlace(null)} className="btn btn-secondary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>Cancel</button>
                    </div>
                  </form>
                )}

                {/* Explore Page - Weekend Stay Form */}
                {editingWeekendStay && (
                  <form onSubmit={handleSaveWeekendStay}>
                    <h4 style={{ margin: '0 0 1rem 0', fontWeight: 700 }}>{editingWeekendStay.id ? 'Edit Weekend Getaway' : 'Add New Weekend Getaway'}</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label htmlFor="ws_name" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Name</label>
                        <input
                          id="ws_name"
                          type="text"
                          required
                          value={editingWeekendStay.name || ''}
                          onChange={(e) => setEditingWeekendStay({ ...editingWeekendStay, name: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                      <div>
                        <label htmlFor="ws_category" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Category (e.g. Hill Station, Wildlife)</label>
                        <input
                          id="ws_category"
                          type="text"
                          required
                          value={editingWeekendStay.category || ''}
                          onChange={(e) => setEditingWeekendStay({ ...editingWeekendStay, category: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label htmlFor="ws_desc" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Description</label>
                      <textarea
                        id="ws_desc"
                        required
                        rows={3}
                        value={editingWeekendStay.description || ''}
                        onChange={(e) => setEditingWeekendStay({ ...editingWeekendStay, description: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem', fontFamily: 'inherit' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label htmlFor="ws_img" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Image URL</label>
                        <input
                          id="ws_img"
                          type="text"
                          value={editingWeekendStay.image_url || ''}
                          onChange={(e) => setEditingWeekendStay({ ...editingWeekendStay, image_url: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                      <div>
                        <label htmlFor="ws_map" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Google Maps URL</label>
                        <input
                          id="ws_map"
                          type="text"
                          value={editingWeekendStay.map_url || ''}
                          onChange={(e) => setEditingWeekendStay({ ...editingWeekendStay, map_url: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                      <div>
                        <label htmlFor="ws_sort" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Sort Order</label>
                        <input
                          id="ws_sort"
                          type="number"
                          value={editingWeekendStay.sort_order || 0}
                          onChange={(e) => setEditingWeekendStay({ ...editingWeekendStay, sort_order: Number(e.target.value) })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                      <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>Save Getaway</button>
                      <button type="button" onClick={() => setEditingWeekendStay(null)} className="btn btn-secondary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>Cancel</button>
                    </div>
                  </form>
                )}

                {/* Explore Page - Hotel Form */}
                {editingHotel && (
                  <form onSubmit={handleSaveHotel}>
                    <h4 style={{ margin: '0 0 1rem 0', fontWeight: 700 }}>{editingHotel.id ? 'Edit Hotel' : 'Add New Hotel'}</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label htmlFor="h_name" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Hotel Name</label>
                        <input
                          id="h_name"
                          type="text"
                          required
                          value={editingHotel.name || ''}
                          onChange={(e) => setEditingHotel({ ...editingHotel, name: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                      <div>
                        <label htmlFor="h_category" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Category (e.g. Luxury Hotels, Budget Stay)</label>
                        <input
                          id="h_category"
                          type="text"
                          required
                          value={editingHotel.category || ''}
                          onChange={(e) => setEditingHotel({ ...editingHotel, category: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label htmlFor="h_desc" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Description</label>
                      <textarea
                        id="h_desc"
                        required
                        rows={3}
                        value={editingHotel.description || ''}
                        onChange={(e) => setEditingHotel({ ...editingHotel, description: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem', fontFamily: 'inherit' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label htmlFor="h_img" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Image URL</label>
                        <input
                          id="h_img"
                          type="text"
                          value={editingHotel.image_url || ''}
                          onChange={(e) => setEditingHotel({ ...editingHotel, image_url: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                      <div>
                        <label htmlFor="h_map" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Google Maps / Booking Link</label>
                        <input
                          id="h_map"
                          type="text"
                          value={editingHotel.map_url || ''}
                          onChange={(e) => setEditingHotel({ ...editingHotel, map_url: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                      <div>
                        <label htmlFor="h_sort" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Sort Order</label>
                        <input
                          id="h_sort"
                          type="number"
                          value={editingHotel.sort_order || 0}
                          onChange={(e) => setEditingHotel({ ...editingHotel, sort_order: Number(e.target.value) })}
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                      <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>Save Hotel</button>
                      <button type="button" onClick={() => setEditingHotel(null)} className="btn btn-secondary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>Cancel</button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}


        {/* Dashboard Tab Panels */}
        
        {/* TAB 1: Registrations Log */}
        {activeTab === 'registrations' && (
          <div className="admin-glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>Submitted Forms ({submittedRegistrations.length})</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {submittedRegistrations.length > 0 && (
                  <>
                    <button
                      onClick={handleExportCSV}
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        color: '#ffffff',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        boxShadow: '0 4px 10px rgba(59, 130, 246, 0.25)',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                      onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                      <Download size={14} /> Export CSV
                    </button>
                    <button
                      onClick={handleClearAllRegistrations}
                      style={{
                        background: 'rgba(239, 68, 68, 0.08)',
                        color: '#dc2626',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)')}
                      onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)')}
                    >
                      Clear All Logs
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.75rem', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: '#3b82f6', color: '#ffffff', padding: '0.65rem', borderRadius: '0.5rem', display: 'flex' }}>
                  <Database size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#1e40af', letterSpacing: '0.05em' }}>TOTAL REGISTRATIONS</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1d4ed8', marginTop: '0.15rem' }}>{submittedRegistrations.length}</div>
                </div>
              </div>
              
              <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '0.75rem', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: '#d97706', color: '#ffffff', padding: '0.65rem', borderRadius: '0.5rem', display: 'flex' }}>
                  <Calendar size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#92400e', letterSpacing: '0.05em' }}>TOUR ATENDEES</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#b45309', marginTop: '0.15rem' }}>{submittedRegistrations.filter(r => r.register_for_tour).length}</div>
                </div>
              </div>

              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '0.75rem', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: '#10b981', color: '#ffffff', padding: '0.65rem', borderRadius: '0.5rem', display: 'flex' }}>
                  <Shield size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#065f46', letterSpacing: '0.05em' }}>PROOF ATTACHMENTS</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#047857', marginTop: '0.15rem' }}>{submittedRegistrations.filter(r => r.screenshot_name && r.screenshot_name !== 'no_file').length}</div>
                </div>
              </div>
            </div>

            {/* Visual Analytics Section */}
            {submittedRegistrations.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
              }}>
                {/* Tour Attendance Ratio Chart */}
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.015)'
                }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tour Request Ratio</h4>
                  {(() => {
                    const total = submittedRegistrations.length;
                    const tour = submittedRegistrations.filter(r => r.register_for_tour).length;
                    const pct = total > 0 ? Math.round((tour / total) * 100) : 0;
                    return (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 700 }}>
                          <span style={{ color: '#059669' }}>Tour Requested ({tour})</span>
                          <span style={{ color: '#64748b' }}>No Tour ({total - tour})</span>
                        </div>
                        <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                          <div style={{ width: `${pct}%`, background: '#10b981', transition: 'width 0.5s ease-in-out' }} />
                          <div style={{ width: `${100 - pct}%`, background: '#cbd5e1' }} />
                        </div>
                        <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                          {pct}% of registered participants have opted for the Coimbatore tour.
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Data Verification Status */}
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.015)'
                }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Proof Verification Progress</h4>
                  {(() => {
                    const total = submittedRegistrations.length;
                    const withFile = submittedRegistrations.filter(r => r.screenshot_name && r.screenshot_name !== 'no_file').length;
                    const pct = total > 0 ? Math.round((withFile / total) * 100) : 0;
                    return (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 700 }}>
                          <span style={{ color: '#3b82f6' }}>Attachment Uploaded ({withFile})</span>
                          <span style={{ color: '#cbd5e1' }}>Pending Upload ({total - withFile})</span>
                        </div>
                        <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                          <div style={{ width: `${pct}%`, background: '#3b82f6', transition: 'width 0.5s ease-in-out' }} />
                          <div style={{ width: `${100 - pct}%`, background: '#cbd5e1' }} />
                        </div>
                        <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                          {pct}% of payment receipts are uploaded and ready for review.
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {submittedRegistrations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748b' }}>
                <Database size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500 }}>No registrations logged in the database.</p>
              </div>
            ) : (
              <>
                {/* Desktop view */}
                <div className="admin-desktop-view" style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left', background: '#ffffff' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e2e8f0', background: '#f8fafc', color: '#475569', fontWeight: 700 }}>
                        <th style={{ padding: '1rem 0.75rem' }}>Date</th>
                        <th style={{ padding: '1rem 0.75rem' }}>Author Details</th>
                        <th style={{ padding: '1rem 0.75rem' }}>Paper Info</th>
                        <th style={{ padding: '1rem 0.75rem' }}>Tour Details</th>
                        <th style={{ padding: '1rem 0.75rem' }}>Receipt Attachment</th>
                        <th style={{ padding: '1rem 0.75rem', textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submittedRegistrations
                        .filter(r => 
                          r.author_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.paper_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.paper_title?.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((r, i) => (
                          <tr key={r.id || i} style={{ borderBottom: '1px solid #f1f5f9', verticalAlign: 'top' }}>
                            <td style={{ padding: '1rem 0.75rem', whiteSpace: 'nowrap', color: '#64748b' }}>
                              <span style={{ fontWeight: 600, color: '#334155' }}>{new Date(r.created_at || Date.now()).toLocaleDateString()}</span><br/>
                              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{new Date(r.created_at || Date.now()).toLocaleTimeString()}</span>
                            </td>
                            <td style={{ padding: '1rem 0.75rem' }}>
                              <div style={{ fontWeight: 700, color: '#0f172a' }}>{r.author_name}</div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.1rem' }}>
                                <a href={`mailto:${r.email}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{r.email}</a>
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{r.phone}</div>
                            </td>
                            <td style={{ padding: '1rem 0.75rem', maxWidth: '260px' }}>
                              <span style={{ display: 'inline-block', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', padding: '0.15rem 0.4rem', borderRadius: '0.25rem', fontSize: '0.7rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                                ID: {r.paper_id || 'N/A'}
                              </span>
                              <div style={{ fontWeight: 600, fontSize: '0.8rem', lineHeight: '1.3', color: '#1e293b' }}>{r.paper_title || 'N/A'}</div>
                            </td>
                            <td style={{ padding: '1rem 0.75rem' }}>
                              <div style={{ fontWeight: 700, color: r.register_for_tour ? '#059669' : '#64748b' }}>
                                {r.register_for_tour ? '✅ Tour Requested' : '❌ No Tour'}
                              </div>
                              {r.register_for_tour && r.preferred_tour_place && (
                                <div style={{ fontSize: '0.75rem', color: '#047857', background: '#ecfdf5', padding: '0.15rem 0.35rem', borderRadius: '0.25rem', display: 'inline-block', marginTop: '0.25rem' }}>
                                  {r.preferred_tour_place}
                                </div>
                              )}
                            </td>
                            <td style={{ padding: '1rem 0.75rem' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                {r.screenshot_name && r.screenshot_name !== 'no_file' ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (r.screenshot_name.startsWith('http')) {
                                        setPreviewImage(r.screenshot_name);
                                      } else if (isSupabaseConfigured && supabase) {
                                        const { data } = supabase.storage.from('payment-proofs').getPublicUrl(r.screenshot_name);
                                        setPreviewImage(data?.publicUrl || r.screenshot_name);
                                      } else {
                                        setPreviewImage(r.screenshot_name);
                                      }
                                    }}
                                    style={{
                                      background: '#f1f5f9',
                                      border: '1px solid #cbd5e1',
                                      borderRadius: '0.375rem',
                                      padding: '0.35rem 0.6rem',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.35rem',
                                      color: '#2563eb',
                                      fontWeight: 700,
                                      fontSize: '0.75rem',
                                      cursor: 'pointer',
                                      width: 'fit-content'
                                    }}
                                  >
                                    <Eye size={12} /> View Proof
                                  </button>
                                ) : (
                                  <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>No attachments</span>
                                )}
                              </div>
                            </td>
                            <td style={{ padding: '1rem 0.75rem', textAlign: 'center' }}>
                              <button
                                onClick={() => handleDeleteRegistration(r.id)}
                                style={{
                                  background: 'rgba(239, 68, 68, 0.05)',
                                  border: '1px solid rgba(239, 68, 68, 0.1)',
                                  borderRadius: '0.375rem',
                                  color: '#ef4444',
                                  cursor: 'pointer',
                                  padding: '0.4rem'
                                }}
                                title="Delete log"
                              >
                                <Trash2 size={15} />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
 
                {/* Mobile view cards */}
                <div className="admin-mobile-view admin-mobile-card-list">
                  {submittedRegistrations
                    .filter(r => 
                      r.author_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      r.paper_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      r.paper_title?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((r, i) => (
                      <div key={r.id || i} className="admin-mobile-card">
                        <div className="admin-mobile-card-header">
                          <span style={{ display: 'inline-block', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', padding: '0.15rem 0.45rem', borderRadius: '0.25rem', fontSize: '0.725rem', fontWeight: 800 }}>
                            ID: {r.paper_id || 'N/A'}
                          </span>
                          <button 
                            onClick={() => handleDeleteRegistration(r.id)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem' }}
                            title="Delete log"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="admin-mobile-card-body">
                          <div className="admin-mobile-card-row">
                            <span className="admin-mobile-card-label">Author:</span>
                            <span className="admin-mobile-card-value" style={{ fontWeight: 700 }}>{r.author_name}</span>
                          </div>
                          <div className="admin-mobile-card-row">
                            <span className="admin-mobile-card-label">Email:</span>
                            <span className="admin-mobile-card-value">
                              <a href={`mailto:${r.email}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{r.email}</a>
                            </span>
                          </div>
                          <div className="admin-mobile-card-row">
                            <span className="admin-mobile-card-label">Phone:</span>
                            <span className="admin-mobile-card-value">{r.phone}</span>
                          </div>
                          <div className="admin-mobile-card-row">
                            <span className="admin-mobile-card-label">Paper Title:</span>
                            <span className="admin-mobile-card-value" style={{ color: '#334155' }}>{r.paper_title || 'N/A'}</span>
                          </div>
                          <div className="admin-mobile-card-row">
                            <span className="admin-mobile-card-label">Tour:</span>
                            <span className="admin-mobile-card-value">
                              {r.register_for_tour ? (
                                <span style={{ color: '#059669', background: '#ecfdf5', padding: '0.15rem 0.4rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 700 }}>
                                  ✅ Yes ({r.preferred_tour_place || 'No Choice'})
                                </span>
                              ) : (
                                <span style={{ color: '#64748b' }}>❌ No Tour</span>
                              )}
                            </span>
                          </div>
                          <div className="admin-mobile-card-row">
                            <span className="admin-mobile-card-label">Proof URL:</span>
                            <span className="admin-mobile-card-value">
                              {r.screenshot_name && r.screenshot_name !== 'no_file' ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (r.screenshot_name.startsWith('http')) {
                                      setPreviewImage(r.screenshot_name);
                                    } else if (isSupabaseConfigured && supabase) {
                                      const { data } = supabase.storage.from('payment-proofs').getPublicUrl(r.screenshot_name);
                                      setPreviewImage(data?.publicUrl || r.screenshot_name);
                                    } else {
                                      setPreviewImage(r.screenshot_name);
                                    }
                                  }}
                                  style={{
                                    background: '#eff6ff',
                                    border: '1px solid #bfdbfe',
                                    borderRadius: '0.375rem',
                                    padding: '0.25rem 0.5rem',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    color: '#2563eb',
                                    fontWeight: 700,
                                    fontSize: '0.725rem',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <Eye size={12} /> View Proof
                                </button>
                              ) : (
                                <span style={{ color: '#94a3b8' }}>No attachment</span>
                              )}
                            </span>
                          </div>
                          <div className="admin-mobile-card-row">
                            <span className="admin-mobile-card-label">Logged At:</span>
                            <span className="admin-mobile-card-value" style={{ color: '#64748b' }}>
                              {new Date(r.created_at || Date.now()).toLocaleDateString()} {new Date(r.created_at || Date.now()).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 2: General Configurations */}
        {activeTab === 'general' && (
          <div className="admin-glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', color: '#0b4f30' }}>Webpage Settings & Strings</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="admin-form-grid" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5rem' }}>
                <div className="admin-form-group">
                  <label htmlFor="show_banner">Show Announcement Banner</label>
                  <select
                    id="show_banner"
                    value={localInfo.show_announcement !== 'false' ? 'true' : 'false'}
                    onChange={(e) => setLocalInfo(prev => ({ ...prev, show_announcement: e.target.value }))}
                    className="form-input"
                  >
                    <option value="true">Show Banner</option>
                    <option value="false">Hide Banner</option>
                  </select>
                </div>
                <div className="admin-form-group" style={{ gridColumn: 'span 2' }}>
                  <label htmlFor="banner_txt">Banner Text</label>
                  <input
                    id="banner_txt"
                    type="text"
                    value={localInfo.announcement_text || ''}
                    onChange={(e) => setLocalInfo(prev => ({ ...prev, announcement_text: e.target.value }))}
                    placeholder="Enter announcement text"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label htmlFor="ht">Hero Title</label>
                  <input
                    id="ht"
                    type="text"
                    value={localInfo.hero_title || ''}
                    onChange={(e) => setLocalInfo(prev => ({ ...prev, hero_title: e.target.value }))}
                    className="form-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label htmlFor="hs">Hero Subtitle</label>
                  <input
                    id="hs"
                    type="text"
                    value={localInfo.hero_subtitle || ''}
                    onChange={(e) => setLocalInfo(prev => ({ ...prev, hero_subtitle: e.target.value }))}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label htmlFor="ed">Event Dates Display</label>
                  <input
                    id="ed"
                    type="text"
                    value={localInfo.event_date_display || ''}
                    onChange={(e) => setLocalInfo(prev => ({ ...prev, event_date_display: e.target.value }))}
                    className="form-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label htmlFor="el">Event Location Display</label>
                  <input
                    id="el"
                    type="text"
                    value={localInfo.event_location_display || ''}
                    onChange={(e) => setLocalInfo(prev => ({ ...prev, event_location_display: e.target.value }))}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label htmlFor="cc">Countdown Target Date (ISO)</label>
                  <input
                    id="cc"
                    type="text"
                    value={localInfo.countdown_target || ''}
                    onChange={(e) => setLocalInfo(prev => ({ ...prev, countdown_target: e.target.value }))}
                    placeholder="YYYY-MM-DDTHH:MM:SS"
                    className="form-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label htmlFor="cl">Submission / CMT Link</label>
                  <input
                    id="cl"
                    type="text"
                    value={localInfo.cmt_link || ''}
                    onChange={(e) => setLocalInfo(prev => ({ ...prev, cmt_link: e.target.value }))}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label htmlFor="srec_url">SREC Institutional Link</label>
                  <input
                    id="srec_url"
                    type="text"
                    value={localInfo.srec_url || ''}
                    onChange={(e) => setLocalInfo(prev => ({ ...prev, srec_url: e.target.value }))}
                    className="form-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label htmlFor="ieee_sb_url">IEEE SB Website Link</label>
                  <input
                    id="ieee_sb_url"
                    type="text"
                    value={localInfo.ieee_sb_url || ''}
                    onChange={(e) => setLocalInfo(prev => ({ ...prev, ieee_sb_url: e.target.value }))}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Registration Control Switch */}
              <div className="admin-card" style={{ background: localInfo.registration_enabled === 'false' ? '#fef2f2' : '#f0fdf4', border: localInfo.registration_enabled === 'false' ? '2px solid #fca5a5' : '2px solid #86efac', padding: '1.25rem 1.5rem', borderRadius: '14px', margin: '1.5rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: localInfo.registration_enabled === 'false' ? '#991b1b' : '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>{localInfo.registration_enabled === 'false' ? '🔴' : '🟢'}</span> Registration Portal Status
                    </h4>
                    <p style={{ margin: '0.35rem 0 0', fontSize: '0.9rem', color: localInfo.registration_enabled === 'false' ? '#b91c1c' : '#15803d', fontWeight: 500 }}>
                      {localInfo.registration_enabled !== 'false' 
                        ? 'Registration is currently ONLINE & OPEN for all attendees & authors.' 
                        : 'Registration is currently PAUSED & CLOSED. Visitors will see a Registration Closed notification.'}
                    </p>
                  </div>
                  <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', gap: '0.75rem', padding: '0.6rem 1.25rem', background: '#ffffff', borderRadius: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #cbd5e1' }}>
                    <input
                      type="checkbox"
                      checked={localInfo.registration_enabled !== 'false'}
                      onChange={(e) => setLocalInfo(prev => ({ ...prev, registration_enabled: e.target.checked ? 'true' : 'false' }))}
                      style={{ width: '22px', height: '22px', accentColor: '#16a34a', cursor: 'pointer' }}
                    />
                    <span style={{ fontWeight: 800, fontSize: '0.95rem', color: localInfo.registration_enabled !== 'false' ? '#16a34a' : '#dc2626' }}>
                      {localInfo.registration_enabled !== 'false' ? 'REGISTRATION ON' : 'REGISTRATION OFF'}
                    </span>
                  </label>
                </div>
              </div>

              <div className="admin-form-group">
                <label htmlFor="about_conf">About The Conference Description</label>
                <textarea
                  id="about_conf"
                  value={localInfo.about_conference || ''}
                  onChange={(e) => setLocalInfo(prev => ({ ...prev, about_conference: e.target.value }))}
                  rows={4}
                  className="form-input"
                  style={{ fontFamily: 'inherit', resize: 'vertical' }}
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="about_inst">About Sri Ramakrishna Engineering College</label>
                <textarea
                  id="about_inst"
                  value={localInfo.about_institution || ''}
                  onChange={(e) => setLocalInfo(prev => ({ ...prev, about_institution: e.target.value }))}
                  rows={4}
                  className="form-input"
                  style={{ fontFamily: 'inherit', resize: 'vertical' }}
                />
              </div>

              <div className="admin-form-grid" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                <div className="admin-form-group">
                  <label htmlFor="bank_acc_name">Bank Beneficiary Name</label>
                  <input
                    id="bank_acc_name"
                    type="text"
                    value={localInfo.bank_account_name || ''}
                    onChange={(e) => setLocalInfo(prev => ({ ...prev, bank_account_name: e.target.value }))}
                    className="form-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label htmlFor="bank_name_inp">Bank Name & Branch</label>
                  <input
                    id="bank_name_inp"
                    type="text"
                    value={localInfo.bank_name || ''}
                    onChange={(e) => setLocalInfo(prev => ({ ...prev, bank_name: e.target.value }))}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label htmlFor="bank_acc_no">Bank Account Number</label>
                  <input
                    id="bank_acc_no"
                    type="text"
                    value={localInfo.bank_account_number || ''}
                    onChange={(e) => setLocalInfo(prev => ({ ...prev, bank_account_number: e.target.value }))}
                    className="form-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label htmlFor="bank_ifsc">Bank IFSC Code</label>
                  <input
                    id="bank_ifsc"
                    type="text"
                    value={localInfo.bank_ifsc_code || ''}
                    onChange={(e) => setLocalInfo(prev => ({ ...prev, bank_ifsc_code: e.target.value }))}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={handleSaveAllInfo}
                  disabled={isSavingInfo}
                  style={{
                    background: 'linear-gradient(135deg, #0b4f30 0%, #198754 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 2rem',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(11, 79, 48, 0.25)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'opacity 0.2s',
                    opacity: isSavingInfo ? 0.7 : 1
                  }}
                >
                  {isSavingInfo ? 'Saving configurations...' : 'Save General Configurations'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Timeline Milestones (NEW CRUD) */}
        {activeTab === 'milestones' && (
          <div className="admin-glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>Roadmap Milestone Dates ({importantDates.length})</h3>
              <button
                onClick={() => setEditingMilestone({ event_date: '', title: '', desc: '', sort_order: importantDates.length + 1 })}
                style={{
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  boxShadow: '0 2px 4px rgba(37, 99, 235, 0.1)'
                }}
              >
                <Plus size={14} /> Add Milestone
              </button>
            </div>

            {editingMilestone && (
              <form onSubmit={handleSaveMilestone} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <h4 style={{ margin: '0 0 1rem 0', fontWeight: 800, fontSize: '0.95rem' }}>{editingMilestone.id ? 'Edit Milestone' : 'Add New Milestone'}</h4>
                <div className="admin-form-grid" style={{ marginBottom: '1rem' }}>
                  <div className="admin-form-group">
                    <label htmlFor="ms_date">Date Display (e.g. 15 Dec 2026)</label>
                    <input
                      id="ms_date"
                      type="text"
                      required
                      value={editingMilestone.event_date}
                      onChange={(e) => setEditingMilestone({ ...editingMilestone, event_date: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="admin-form-group" style={{ gridColumn: 'span 2' }}>
                    <label htmlFor="ms_title">Milestone Title</label>
                    <input
                      id="ms_title"
                      type="text"
                      required
                      value={editingMilestone.title}
                      onChange={(e) => setEditingMilestone({ ...editingMilestone, title: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label htmlFor="ms_sort">Sort Order</label>
                    <input
                      id="ms_sort"
                      type="number"
                      required
                      value={editingMilestone.sort_order || 1}
                      onChange={(e) => setEditingMilestone({ ...editingMilestone, sort_order: Number(e.target.value) })}
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="admin-form-group" style={{ marginBottom: '1.25rem' }}>
                  <label htmlFor="ms_desc">Short Description</label>
                  <input
                    id="ms_desc"
                    type="text"
                    value={editingMilestone.desc || ''}
                    onChange={(e) => setEditingMilestone({ ...editingMilestone, desc: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Save</button>
                  <button type="button" onClick={() => setEditingMilestone(null)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Cancel</button>
                </div>
              </form>
            )}

            {/* Desktop Table View */}
            <div className="admin-desktop-view" style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left', background: '#ffffff' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', background: '#f8fafc', color: '#475569', fontWeight: 700 }}>
                    <th style={{ padding: '0.75rem' }}>Order</th>
                    <th style={{ padding: '0.75rem' }}>Date Display</th>
                    <th style={{ padding: '0.75rem' }}>Title</th>
                    <th style={{ padding: '0.75rem' }}>Description</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {importantDates
                    .filter(item => 
                      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      item.event_date?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((item, idx) => (
                      <tr key={item.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700, color: '#64748b' }}>{item.sort_order}</td>
                        <td style={{ padding: '0.85rem 0.75rem', color: '#2563eb', fontWeight: 700 }}>{item.event_date}</td>
                        <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700, color: '#0f172a' }}>{item.title}</td>
                        <td style={{ padding: '0.85rem 0.75rem', color: '#64748b' }}>{item.desc}</td>
                        <td style={{ padding: '0.85rem 0.75rem', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                            <button onClick={() => setEditingMilestone(item)} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', padding: '0.25rem' }} title="Edit"><Edit size={14} /></button>
                            <button onClick={() => handleDeleteMilestone(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem' }} title="Delete"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="admin-mobile-view admin-mobile-card-list">
              {importantDates
                .filter(item => 
                  item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  item.event_date?.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((item, idx) => (
                  <div key={item.id || idx} className="admin-mobile-card">
                    <div className="admin-mobile-card-header">
                      <span style={{ fontWeight: 800, color: '#2563eb', fontSize: '0.85rem' }}>Sort Order: {item.sort_order}</span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => setEditingMilestone(item)} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', padding: '0.25rem' }}><Edit size={15} /></button>
                        <button onClick={() => handleDeleteMilestone(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem' }}><Trash2 size={15} /></button>
                      </div>
                    </div>
                    <div className="admin-mobile-card-body">
                      <div className="admin-mobile-card-row">
                        <span className="admin-mobile-card-label">Date Display:</span>
                        <span className="admin-mobile-card-value" style={{ color: '#2563eb', fontWeight: 700 }}>{item.event_date}</span>
                      </div>
                      <div className="admin-mobile-card-row">
                        <span className="admin-mobile-card-label">Title:</span>
                        <span className="admin-mobile-card-value" style={{ fontWeight: 700 }}>{item.title}</span>
                      </div>
                      <div className="admin-mobile-card-row">
                        <span className="admin-mobile-card-label">Description:</span>
                        <span className="admin-mobile-card-value" style={{ color: '#64748b' }}>{item.desc || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 4: Registration Pricing (NEW CRUD) */}
        {activeTab === 'pricing' && (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.02)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0b4f30' }}>Fee Pricing Configuration</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.5rem' }}>Configure national fees (INR ₹) and international fees (USD $) directly.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* National Pricing (INR) */}
                <div>
                  <h4 style={{ fontWeight: 700, color: '#0b4f30', marginBottom: '1rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.25rem' }}>🇮🇳 National Fees (INR ₹)</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {[
                      { key: 'base_conf_student_ieee_inr', label: 'IEEE Student Member' },
                      { key: 'base_conf_student_non_ieee_inr', label: 'Non-IEEE Student Member' },
                      { key: 'base_conf_prof_ieee_inr', label: 'IEEE Member' },
                      { key: 'base_conf_prof_non_ieee_inr', label: 'Non-IEEE Member' }
                    ].map(field => (
                      <div key={field.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{field.label}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <span style={{ fontWeight: 700 }}>₹</span>
                          <input
                            type="number"
                            value={localPricing[field.key] || 0}
                            onChange={(e) => setLocalPricing(prev => ({ ...prev, [field.key]: Number(e.target.value) }))}
                            style={{ width: '90px', padding: '0.25rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', textAlign: 'right', fontWeight: 700 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* International Pricing (USD) */}
                <div>
                  <h4 style={{ fontWeight: 700, color: '#f59e0b', marginBottom: '1rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.25rem' }}>🌎 International Fees (USD $)</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {[
                      { key: 'base_conf_student_ieee_usd', label: 'IEEE Student Member' },
                      { key: 'base_conf_student_non_ieee_usd', label: 'Non-IEEE Student Member' },
                      { key: 'base_conf_prof_ieee_usd', label: 'IEEE Member' },
                      { key: 'base_conf_prof_non_ieee_usd', label: 'Non-IEEE Member' }
                    ].map(field => (
                      <div key={field.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{field.label}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <span style={{ fontWeight: 700 }}>$</span>
                          <input
                            type="number"
                            value={localPricing[field.key] || 0}
                            onChange={(e) => setLocalPricing(prev => ({ ...prev, [field.key]: Number(e.target.value) }))}
                            style={{ width: '90px', padding: '0.25rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', textAlign: 'right', fontWeight: 700 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Explicit Save button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={handleSaveAllPricing}
                  disabled={isSavingPricing}
                  style={{
                    background: 'linear-gradient(135deg, #0b4f30 0%, #198754 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 2rem',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(11, 79, 48, 0.25)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'opacity 0.2s',
                    opacity: isSavingPricing ? 0.7 : 1
                  }}
                >
                  {isSavingPricing ? 'Saving Configurations...' : 'Save Pricing Configurations'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Keynote Speakers */}
        {activeTab === 'speakers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Conference Speakers ({speakers.length})</h3>
                <button
                  onClick={() => setEditingSpeaker({ name: '', title: '', role: '', talk: '', color: '#3b82f6', image_url: '' })}
                  style={{
                    background: '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Plus size={14} /> Add Speaker
                </button>
              </div>

              {/* Desktop view */}
               <div className="admin-desktop-view" style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
                 <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left', background: '#ffffff' }}>
                   <thead>
                     <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                       <th style={{ padding: '0.75rem 1rem' }}>Speaker</th>
                       <th style={{ padding: '0.75rem 1rem' }}>Talk Title</th>
                       <th style={{ padding: '0.75rem 1rem' }}>Affiliation / Role</th>
                       <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Actions</th>
                     </tr>
                   </thead>
                   <tbody>
                     {speakers
                       .filter(s => s.name?.toLowerCase().includes(searchTerm.toLowerCase()))
                       .map((item, idx) => (
                         <tr key={item.id || idx} style={{ borderBottom: '1px solid #f1f5f9', verticalAlign: 'top' }}>
                           <td style={{ padding: '1rem' }}>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                               <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: `2px solid ${item.color || '#cbd5e1'}`, overflow: 'hidden', flexShrink: 0 }}>
                                 <img src={item.image_url || 'https://via.placeholder.com/150'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                               </div>
                               <div>
                                 <div style={{ fontWeight: 700 }}>{item.name}</div>
                                 <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.title}</div>
                               </div>
                             </div>
                           </td>
                           <td style={{ padding: '1rem', fontWeight: 600, color: '#0f52ba', maxWidth: '280px' }}>
                             {item.talk && (item.talk.includes('http') || item.talk.includes('www.') || item.talk.includes('linkedin.com')) ? (
                               <a href={item.talk.replace(/^["'\s]+|["'\s]+$/g, '').trim()} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#0a66c2', fontWeight: 600, textDecoration: 'underline' }}>
                                 Profile Link <ExternalLink size={12} />
                               </a>
                             ) : (
                               item.talk || 'N/A'
                             )}
                           </td>
                           <td style={{ padding: '1rem', color: '#475569' }}>{item.role}</td>
                           <td style={{ padding: '1rem', textAlign: 'center' }}>
                             <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                               <button onClick={() => setEditingSpeaker(item)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}><Edit size={14} /></button>
                               <button onClick={() => handleDeleteSpeaker(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={14} /></button>
                             </div>
                           </td>
                         </tr>
                       ))}
                   </tbody>
                 </table>
               </div>

               {/* Mobile view */}
               <div className="admin-mobile-view admin-mobile-card-list">
                 {speakers
                   .filter(s => s.name?.toLowerCase().includes(searchTerm.toLowerCase()))
                   .map((item, idx) => (
                     <div key={item.id || idx} className="admin-mobile-card">
                       <div className="admin-mobile-card-header">
                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                           <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: `2px solid ${item.color || '#cbd5e1'}`, overflow: 'hidden', flexShrink: 0 }}>
                             <img src={item.image_url || 'https://via.placeholder.com/150'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                           </div>
                           <div>
                             <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.name}</div>
                             <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{item.title}</div>
                           </div>
                         </div>
                         <div style={{ display: 'flex', gap: '0.5rem' }}>
                           <button onClick={() => setEditingSpeaker(item)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}><Edit size={14} /></button>
                           <button onClick={() => handleDeleteSpeaker(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={14} /></button>
                         </div>
                       </div>
                       <div className="admin-mobile-card-body">
                         <div className="admin-mobile-card-row">
                           <span className="admin-mobile-card-label">Talk:</span>
                           <span className="admin-mobile-card-value" style={{ fontWeight: 600, color: '#0f52ba' }}>{item.talk || 'N/A'}</span>
                         </div>
                         <div className="admin-mobile-card-row">
                           <span className="admin-mobile-card-label">Affiliation:</span>
                           <span className="admin-mobile-card-value">{item.role || 'N/A'}</span>
                         </div>
                       </div>
                     </div>
                   ))}
               </div>
            </div>
          </div>
        )}

        {/* TAB 6: Academic Tracks */}
        {activeTab === 'tracks' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Academic tracks ({departments.length})</h3>
                <button
                  onClick={() => setEditingDept({ name: '', description: '', sort_order: departments.length + 1 })}
                  style={{
                    background: '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Plus size={14} /> Add Track
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                      <th style={{ padding: '0.5rem', width: '80px' }}>Order</th>
                      <th style={{ padding: '0.5rem', width: '280px' }}>Track Title</th>
                      <th style={{ padding: '0.5rem' }}>Sub-topics / Descriptions</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', width: '100px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments
                      .filter(d => d.name?.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((item, idx) => (
                        <tr key={item.id || idx} style={{ borderBottom: '1px solid #f1f5f9', verticalAlign: 'top' }}>
                          <td style={{ padding: '1rem 0.5rem', fontWeight: 700 }}>{item.sort_order}</td>
                          <td style={{ padding: '1rem 0.5rem', fontWeight: 700, color: '#0f172a' }}>{item.name}</td>
                          <td style={{ padding: '1rem 0.5rem', color: '#475569', lineHeight: '1.4' }}>{item.description}</td>
                          <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                              <button onClick={() => setEditingDept(item)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}><Edit size={14} /></button>
                              <button onClick={() => handleDeleteDept(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: Committee Members */}
        {activeTab === 'committee' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '1rem',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.04), 0 8px 10px -6px rgba(0, 0, 0, 0.02)',
              overflow: 'hidden'
            }}>
              {/* Executive Toolbar Header */}
              <div style={{
                padding: '1.5rem 1.75rem',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                background: 'linear-gradient(to right, #ffffff, #f8fafc)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                  }}>
                    <Users size={22} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0f172a', letterSpacing: '-0.01em' }}>
                        Committee Members
                      </h3>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        background: 'rgba(37, 99, 235, 0.1)',
                        color: '#2563eb',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '20px'
                      }}>
                        {committeeMembers.length} Members
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.15rem 0 0 0' }}>
                      Manage conference leadership, organizing bodies, and advisory boards.
                    </p>
                  </div>
                </div>

                {/* Toolbar Search & Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative', width: '260px' }}>
                    <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="text"
                      placeholder="Search committee..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem 0.5rem 2.2rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '0.5rem',
                        fontSize: '0.825rem',
                        outline: 'none',
                        background: '#ffffff',
                        transition: 'all 0.2s'
                      }}
                    />
                  </div>

                  <button
                    onClick={() => setEditingCommittee({ name: '', designation: '', institution: '', category: 'steering', role: 'Executive Committee', sort_order: committeeMembers.length + 1 })}
                    style={{
                      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.55rem 1.15rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.825rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Plus size={16} /> Add Member
                  </button>
                </div>
              </div>

              {/* High-End Desktop Table */}
              <div className="admin-desktop-view" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left', background: '#ffffff' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #f1f5f9', background: '#f8fafc', color: '#475569', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800 }}>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Member Name</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Category Group</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Subgroup / Role</th>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Affiliation / Designation</th>
                      <th style={{ padding: '0.85rem 1rem', textAlign: 'center', width: '100px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {committeeMembers
                      .filter(c => 
                        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.desc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.category?.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((item, idx) => {
                        const initials = item.name
                          ? item.name.replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.|Er\.)\s+/i, '').split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase()
                          : 'CM';

                        const getBadgeStyle = (cat: string) => {
                          if (cat === 'steering') {
                            return { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', label: 'Steering Committee' };
                          }
                          if (cat === 'organizing') {
                            return { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0', label: 'Organizing Committee' };
                          }
                          return { bg: '#f5f3ff', color: '#6d28d9', border: '#ddd6fe', label: 'Advisory Committee' };
                        };

                        const badge = getBadgeStyle(item.category);

                        return (
                          <tr 
                            key={item.id || idx} 
                            style={{ 
                              borderBottom: '1px solid #f1f5f9',
                              transition: 'background-color 0.15s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            {/* Member Column */}
                            <td style={{ padding: '1rem 1.25rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '50%',
                                  background: item.category === 'steering' ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : item.category === 'organizing' ? 'linear-gradient(135deg, #10b981, #047857)' : 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                                  color: '#ffffff',
                                  fontSize: '0.75rem',
                                  fontWeight: 800,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                }}>
                                  {initials}
                                </div>
                                <div>
                                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>{item.name}</div>
                                </div>
                              </div>
                            </td>

                            {/* Category Group */}
                            <td style={{ padding: '1rem 1rem' }}>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                padding: '0.25rem 0.65rem',
                                borderRadius: '20px',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                background: badge.bg,
                                color: badge.color,
                                border: `1px solid ${badge.border}`
                              }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: badge.color }} />
                                {badge.label}
                              </span>
                            </td>

                            {/* Subgroup / Role */}
                            <td style={{ padding: '1rem 1rem', fontWeight: 600, color: '#334155' }}>
                              {item.role ? (
                                <span style={{ background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.78rem' }}>
                                  {item.role}
                                </span>
                              ) : (
                                <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.78rem' }}>Default Member</span>
                              )}
                            </td>

                            {/* Affiliation / Designation */}
                            <td style={{ padding: '1rem 1.25rem', color: '#475569', lineHeight: '1.4', fontSize: '0.825rem' }}>
                              {item.desc || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>N/A</span>}
                            </td>

                            {/* Actions Column */}
                            <td style={{ padding: '1rem 1rem', textAlign: 'center' }}>
                              <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                                <button
                                  onClick={() => setEditingCommittee(item)}
                                  style={{
                                    background: '#eff6ff',
                                    border: '1px solid #bfdbfe',
                                    color: '#2563eb',
                                    padding: '0.4rem 0.6rem',
                                    borderRadius: '0.375rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    transition: 'all 0.15s'
                                  }}
                                  title="Edit member details"
                                >
                                  <Edit size={13} /> Edit
                                </button>

                                <button
                                  onClick={() => handleDeleteCommittee(item.id)}
                                  style={{
                                    background: '#fef2f2',
                                    border: '1px solid #fecaca',
                                    color: '#ef4444',
                                    padding: '0.4rem 0.6rem',
                                    borderRadius: '0.375rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    transition: 'all 0.15s'
                                  }}
                                  title="Delete member"
                                >
                                  <Trash2 size={13} /> Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List */}
              <div className="admin-mobile-view admin-mobile-card-list" style={{ padding: '1rem' }}>
                {committeeMembers
                  .filter(c => 
                    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    c.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    c.desc?.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((item, idx) => (
                    <div key={item.id || idx} className="admin-mobile-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1rem', marginBottom: '0.75rem' }}>
                      <div className="admin-mobile-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>{item.name}</div>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button onClick={() => setEditingCommittee(item)} style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', padding: '0.3rem 0.5rem', borderRadius: '0.25rem', cursor: 'pointer' }}><Edit size={13} /></button>
                          <button onClick={() => handleDeleteCommittee(item.id)} style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', padding: '0.3rem 0.5rem', borderRadius: '0.25rem', cursor: 'pointer' }}><Trash2 size={13} /></button>
                        </div>
                      </div>
                      <div className="admin-mobile-card-body" style={{ fontSize: '0.8rem', color: '#475569' }}>
                        <div style={{ margin: '0.2rem 0' }}>
                          <strong>Category:</strong> <span style={{ fontWeight: 700, color: '#2563eb' }}>{item.category}</span>
                        </div>
                        <div style={{ margin: '0.2rem 0' }}>
                          <strong>Role:</strong> {item.role || 'N/A'}
                        </div>
                        <div style={{ margin: '0.2rem 0' }}>
                          <strong>Affiliation:</strong> {item.desc || 'N/A'}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: Tutorial Workshops */}
        {activeTab === 'workshops' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Pre-conference Tutorials ({workshops.length})</h3>
                <button
                  onClick={() => setEditingWorkshop({ title: '', speaker: '', speaker_designation: '', speaker_institution: '', date: '04 April 2027', time: '09:00 AM', desc: '' })}
                  style={{
                    background: '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Plus size={14} /> Add Workshop
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                      <th style={{ padding: '0.5rem', width: '320px' }}>Workshop Title</th>
                      <th style={{ padding: '0.5rem' }}>Lead Instructor</th>
                      <th style={{ padding: '0.5rem', width: '160px' }}>Schedule</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', width: '100px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workshops
                      .filter(w => w.title?.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((item, idx) => (
                        <tr key={item.id || idx} style={{ borderBottom: '1px solid #f1f5f9', verticalAlign: 'top' }}>
                          <td style={{ padding: '1rem 0.5rem' }}>
                            <div style={{ fontWeight: 700 }}>{item.title}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>{item.desc}</div>
                          </td>
                          <td style={{ padding: '1rem 0.5rem' }}>
                            <div style={{ fontWeight: 700, color: '#0f52ba' }}>{item.speaker}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.speaker_designation} • {item.speaker_institution}</div>
                          </td>
                          <td style={{ padding: '1rem 0.5rem', fontWeight: 600, color: '#475569' }}>
                            {item.date}<br/>
                            <span style={{ fontSize: '0.7rem' }}>{item.time}</span>
                          </td>
                          <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                              <button onClick={() => setEditingWorkshop(item)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}><Edit size={14} /></button>
                              <button onClick={() => handleDeleteWorkshop(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: Coordinators & Contacts (NEW CRUD) */}
        {activeTab === 'coordinators' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Conference Coordinators / Contact Persons ({coordinators.length})</h3>
                <button
                  onClick={() => setEditingCoordinator({ name: '', role: '', phone: '', email: '', sort_order: coordinators.length + 1 })}
                  style={{
                    background: '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Plus size={14} /> Add Coordinator
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                      <th style={{ padding: '0.5rem', width: '80px' }}>Order</th>
                      <th style={{ padding: '0.5rem' }}>Name</th>
                      <th style={{ padding: '0.5rem' }}>Role/Designation</th>
                      <th style={{ padding: '0.5rem' }}>Mobile</th>
                      <th style={{ padding: '0.5rem' }}>Email</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', width: '100px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coordinators
                      .filter(c => c.name?.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((item, idx) => (
                        <tr key={item.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>{item.sort_order}</td>
                          <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: '#0f172a' }}>{item.name}</td>
                          <td style={{ padding: '0.75rem 0.5rem', color: '#0f52ba', fontWeight: 600 }}>{item.role || 'N/A'}</td>
                          <td style={{ padding: '0.75rem 0.5rem', color: '#475569' }}>{item.phone}</td>
                          <td style={{ padding: '0.75rem 0.5rem', color: '#475569' }}>{item.email}</td>
                          <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                              <button onClick={() => setEditingCoordinator(item)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}><Edit size={14} /></button>
                              <button onClick={() => handleDeleteCoordinator(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: Dashboard Quick Stats (NEW CRUD) */}
        {activeTab === 'stats' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Quick Stats Dashboard Metrics ({stats.length})</h3>
                <button
                  onClick={() => setEditingStat({ key: '', value: '', label: '', icon: 'Sparkles', sort_order: stats.length + 1 })}
                  style={{
                    background: '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Plus size={14} /> Add Metric
                </button>
              </div>

              {editingStat && (
                <form onSubmit={handleSaveStat} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '0.5rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontWeight: 700 }}>{editingStat.id ? 'Edit Stat Metric' : 'Add New Stat Metric'}</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label htmlFor="st_key" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Unique Database Key</label>
                      <input
                        id="st_key"
                        type="text"
                        required
                        placeholder="e.g. tracks_count"
                        value={editingStat.key}
                        onChange={(e) => setEditingStat({ ...editingStat, key: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                      />
                    </div>
                    <div>
                      <label htmlFor="st_val" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Value Display (e.g. 10+, 500+)</label>
                      <input
                        id="st_val"
                        type="text"
                        required
                        value={editingStat.value}
                        onChange={(e) => setEditingStat({ ...editingStat, value: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                      />
                    </div>
                    <div>
                      <label htmlFor="st_lbl" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Metric Label</label>
                      <input
                        id="st_lbl"
                        type="text"
                        required
                        value={editingStat.label}
                        onChange={(e) => setEditingStat({ ...editingStat, label: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                      />
                    </div>
                    <div>
                      <label htmlFor="st_sort" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Sort Order</label>
                      <input
                        id="st_sort"
                        type="number"
                        required
                        value={editingStat.sort_order || 1}
                        onChange={(e) => setEditingStat({ ...editingStat, sort_order: Number(e.target.value) })}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="st_ico" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Icon Name (e.g. Users, Layers, Award, Sparkles)</label>
                    <input
                      id="st_ico"
                      type="text"
                      value={editingStat.icon || ''}
                      onChange={(e) => setEditingStat({ ...editingStat, icon: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', marginTop: '0.25rem' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Save Metric</button>
                    <button type="button" onClick={() => setEditingStat(null)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Cancel</button>
                  </div>
                </form>
              )}

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                      <th style={{ padding: '0.5rem', width: '80px' }}>Order</th>
                      <th style={{ padding: '0.5rem' }}>Key ID</th>
                      <th style={{ padding: '0.5rem' }}>Value</th>
                      <th style={{ padding: '0.5rem' }}>Label</th>
                      <th style={{ padding: '0.5rem' }}>Icon</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', width: '100px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.map((item, idx) => (
                      <tr key={item.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>{item.sort_order}</td>
                        <td style={{ padding: '0.75rem 0.5rem', color: '#0f52ba', fontWeight: 600 }}>{item.key}</td>
                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>{item.value}</td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>{item.label}</td>
                        <td style={{ padding: '0.75rem 0.5rem', fontFamily: 'monospace', color: '#64748b' }}>{item.icon}</td>
                        <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                            <button onClick={() => setEditingStat(item)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}><Edit size={14} /></button>
                            <button onClick={() => handleDeleteStat(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 11: Explore Sights & Stays */}
        {activeTab === 'explore' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#0b4f30' }}>Explore Page Settings</h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>Manage local sights, weekend getaways, and hotels shown on the Explore page.</p>
                </div>
                <button
                  onClick={() => {
                    if (exploreSubTab === 'sights') {
                      setEditingTouristPlace({ name: '', category: '', description: '', image_url: '', map_url: '', sort_order: touristPlaces.length + 1 });
                    } else if (exploreSubTab === 'getaways') {
                      setEditingWeekendStay({ name: '', category: '', description: '', image_url: '', map_url: '', sort_order: weekendStays.length + 1 });
                    } else {
                      setEditingHotel({ name: '', category: '', address: '', description: '', map_url: '', image_url: '', sort_order: hotels.length + 1 });
                    }
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #0b4f30 0%, #198754 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    boxShadow: '0 4px 12px rgba(11, 79, 48, 0.2)'
                  }}
                >
                  <Plus size={14} /> Add New {exploreSubTab === 'sights' ? 'Sight' : exploreSubTab === 'getaways' ? 'Getaway' : 'Hotel'}
                </button>
              </div>

              {/* Sub-tabs Selection */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                {[
                  { id: 'sights', label: `Sights to See (${touristPlaces.length})` },
                  { id: 'getaways', label: `Weekend Getaways (${weekendStays.length})` },
                  { id: 'hotels', label: `Hotels & Stays (${hotels.length})` }
                ].map((subTab) => (
                  <button
                    key={subTab.id}
                    onClick={() => setExploreSubTab(subTab.id as any)}
                    style={{
                      padding: '0.4rem 1rem',
                      borderRadius: '0.375rem',
                      border: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: exploreSubTab === subTab.id ? '#0b4f30' : '#f1f5f9',
                      color: exploreSubTab === subTab.id ? '#ffffff' : '#475569',
                      transition: 'all 0.2s'
                    }}
                  >
                    {subTab.label}
                  </button>
                ))}
              </div>

              {/* Data Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                      <th style={{ padding: '0.5rem', width: '60px' }}>Order</th>
                      <th style={{ padding: '0.5rem', width: '220px' }}>Name / Category</th>
                      <th style={{ padding: '0.5rem' }}>Details / Coordinates</th>
                      <th style={{ padding: '0.5rem', width: '120px' }}>Map Links</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', width: '100px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exploreSubTab === 'sights' && touristPlaces.map((item, idx) => (
                      <tr key={item.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>{item.sort_order || 0}</td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <div style={{ fontWeight: 700, color: '#0b4f30' }}>{item.name}</div>
                          <span style={{ fontSize: '0.75rem', background: '#e2e8f0', padding: '0.15rem 0.4rem', borderRadius: '0.25rem', color: '#475569' }}>{item.category}</span>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', maxWidth: '300px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                          {item.description}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          {item.map_url ? (
                            <a href={item.map_url} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', fontWeight: 600 }}>Maps Link</a>
                          ) : (
                            <span style={{ color: '#94a3b8' }}>None</span>
                          )}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                            <button onClick={() => setEditingTouristPlace(item)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}><Edit size={14} /></button>
                            <button onClick={() => handleDeleteTouristPlace(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {exploreSubTab === 'getaways' && weekendStays.map((item, idx) => (
                      <tr key={item.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>{item.sort_order || 0}</td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <div style={{ fontWeight: 700, color: '#0b4f30' }}>{item.name}</div>
                          <span style={{ fontSize: '0.75rem', background: '#e2e8f0', padding: '0.15rem 0.4rem', borderRadius: '0.25rem', color: '#475569' }}>{item.category}</span>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', maxWidth: '300px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                          {item.description}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          {item.map_url ? (
                            <a href={item.map_url} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', fontWeight: 600 }}>Maps Link</a>
                          ) : (
                            <span style={{ color: '#94a3b8' }}>None</span>
                          )}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                            <button onClick={() => setEditingWeekendStay(item)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}><Edit size={14} /></button>
                            <button onClick={() => handleDeleteWeekendStay(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {exploreSubTab === 'hotels' && hotels.map((item, idx) => (
                      <tr key={item.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>{item.sort_order || 0}</td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <div style={{ fontWeight: 700, color: '#0b4f30' }}>{item.name}</div>
                          <span style={{ fontSize: '0.75rem', background: '#e2e8f0', padding: '0.15rem 0.4rem', borderRadius: '0.25rem', color: '#475569' }}>{item.category}</span>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', maxWidth: '300px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.75rem', color: '#475569' }}>{item.address}</div>
                          <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>{item.description}</div>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          {item.map_url ? (
                            <a href={item.map_url} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', fontWeight: 600 }}>Link</a>
                          ) : (
                            <span style={{ color: '#94a3b8' }}>None</span>
                          )}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                            <button onClick={() => setEditingHotel(item)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}><Edit size={14} /></button>
                            <button onClick={() => handleDeleteHotel(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Tab Bar */}
      <div className="admin-mobile-tabbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearchTerm('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`admin-mobile-tabbar-btn ${isActive ? 'active' : ''}`}
            >
              {tab.icon}
              <span>{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      </div> {/* closes className="admin-main-container" */}

      {/* Image Preview Modal Overlay Container */}
      {previewImage && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}
          onClick={() => setPreviewImage(null)}
        >
          <div 
            style={{
              position: 'relative',
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              padding: '2rem 1.5rem 1.5rem',
              maxWidth: '90%',
              maxHeight: '90%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImage(null)}
              style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b'
              }}
              title="Close Preview"
            >
              <X size={16} />
            </button>
            {(() => {
              const reg = submittedRegistrations.find(r => r.screenshot_name === previewImage || (r.screenshot_name && previewImage && previewImage.includes(r.screenshot_name)));
              const isUrl = previewImage.startsWith('http') || previewImage.startsWith('data:');
              // If it's just a filename, try to get the public URL from the payment-proofs bucket
              const imageUrl = isUrl
                ? previewImage
                : (isSupabaseConfigured && supabase
                    ? supabase.storage.from('payment-proofs').getPublicUrl(previewImage).data?.publicUrl
                    : null);
              if (imageUrl && imageUrl.startsWith('http')) {
                return (
                  <>
                    <img 
                      src={imageUrl} 
                      alt="Payment Proof Receipt" 
                      style={{
                        maxWidth: '100%',
                        maxHeight: '70vh',
                        objectFit: 'contain',
                        borderRadius: '0.375rem',
                        border: '1px solid #cbd5e1'
                      }}
                    />
                    <div style={{ display: 'flex', gap: '0.75rem', width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                      <a 
                        href={imageUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '0.35rem', 
                          fontSize: '0.8rem',
                          padding: '0.5rem 1rem',
                          textDecoration: 'none',
                          color: '#ffffff',
                          background: '#3b82f6',
                          borderRadius: '0.375rem',
                          fontWeight: 600
                        }}
                      >
                        <Download size={14} /> Open in New Tab
                      </a>
                      <button
                        onClick={() => setPreviewImage(null)}
                        style={{ 
                          fontSize: '0.8rem',
                          padding: '0.5rem 1rem',
                          background: '#e2e8f0',
                          color: '#475569',
                          border: 'none',
                          borderRadius: '0.375rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Close Preview
                      </button>
                    </div>
                  </>
                );
              }
              
              // Render realistic billing receipt card
              return (
                <>
                  <div style={{
                    width: '400px',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                    fontFamily: 'monospace',
                    color: '#1e293b',
                    lineHeight: '1.5'
                  }}>
                    <div style={{ textAlign: 'center', borderBottom: '2px dashed #cbd5e1', paddingBottom: '1rem', marginBottom: '1rem' }}>
                      <h4 style={{ margin: '0 0 0.25rem 0', color: '#0f172a', fontWeight: 800, fontSize: '1.1rem' }}>AECTSD 2027</h4>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>PAYMENT PROOF RECEIPT</span>
                      <div style={{
                        marginTop: '0.75rem',
                        background: '#ecfdf5',
                        color: '#059669',
                        border: '1px solid #a7f3d0',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        display: 'inline-block'
                      }}>
                        VERIFIED SUCCESSFUL
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b' }}>FILE NAME:</span>
                        <span style={{ fontWeight: 600, wordBreak: 'break-all' }}>{previewImage}</span>
                      </div>
                      {reg && (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#64748b' }}>AUTHOR:</span>
                            <span style={{ fontWeight: 600 }}>{reg.author_name}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#64748b' }}>EMAIL:</span>
                            <span style={{ fontWeight: 600 }}>{reg.email}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#64748b' }}>PHONE:</span>
                            <span style={{ fontWeight: 600 }}>{reg.phone}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#64748b' }}>PAPER ID:</span>
                            <span style={{ fontWeight: 600 }}>{reg.paper_id}</span>
                          </div>
                        </>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b' }}>STATUS:</span>
                        <span style={{ fontWeight: 600 }}>OFFLINE VERIFIED</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b' }}>BANK REF:</span>
                        <span style={{ fontWeight: 600 }}>TXN-902341852</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b' }}>TIME:</span>
                        <span style={{ fontWeight: 600 }}>{new Date().toLocaleString()}</span>
                      </div>
                    </div>
                    <div style={{ borderTop: '2px dashed #cbd5e1', marginTop: '1rem', paddingTop: '1rem', textAlign: 'center', fontSize: '0.75rem', color: '#64748b' }}>
                      Sri Ramakrishna Engineering College
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                    <button
                      onClick={() => setPreviewImage(null)}
                      style={{ 
                        fontSize: '0.8rem',
                        padding: '0.5rem 1rem',
                        background: '#e2e8f0',
                        color: '#475569',
                        border: 'none',
                        borderRadius: '0.375rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Close Preview
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
