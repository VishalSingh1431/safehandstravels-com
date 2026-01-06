import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Save, Plus, X, GripVertical, Eye, EyeOff, Settings, ArrowUp, ArrowDown, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { authAPI, productPageSettingsAPI } from '../config/api';

const AdminProductPageSettings = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    tabs: true,
    sections: true,
    booking: true,
    display: true,
    cta: true,
    templates: false
  });

  const [settings, setSettings] = useState({
    tabs: [],
    sections: [],
    bookingCard: {},
    displaySettings: {},
    cta: {},
    defaultTemplates: {}
  });

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  const checkAuthAndLoad = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      if (response.user) {
        setUser(response.user);
        if (response.user.role !== 'admin' && response.user.role !== 'main_admin') {
          toast.error('Access denied. Admin privileges required.');
          navigate('/');
          return;
        }
        await loadSettings();
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      toast.error('Please login to continue');
      navigate('/login');
    }
  };

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await productPageSettingsAPI.getSettingsAdmin();
      if (response.settings) {
        setSettings(response.settings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await productPageSettingsAPI.updateSettings(settings);
      toast.success('Product page settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const toggleTab = (tabId) => {
    setSettings(prev => ({
      ...prev,
      tabs: prev.tabs.map(tab =>
        tab.id === tabId ? { ...tab, enabled: !tab.enabled } : tab
      )
    }));
  };

  const toggleSectionVisibility = (sectionId) => {
    setSettings(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, enabled: !section.enabled } : section
      )
    }));
  };

  const updateTabOrder = (tabId, direction) => {
    setSettings(prev => {
      const tabs = [...prev.tabs];
      const index = tabs.findIndex(t => t.id === tabId);
      if (index === -1) return prev;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= tabs.length) return prev;
      
      [tabs[index], tabs[newIndex]] = [tabs[newIndex], tabs[index]];
      tabs.forEach((tab, i) => { tab.order = i + 1; });
      
      return { ...prev, tabs };
    });
  };

  const updateSectionOrder = (sectionId, direction) => {
    setSettings(prev => {
      const sections = [...prev.sections];
      const index = sections.findIndex(s => s.id === sectionId);
      if (index === -1) return prev;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= sections.length) return prev;
      
      [sections[index], sections[newIndex]] = [sections[newIndex], sections[index]];
      sections.forEach((section, i) => { section.order = i + 1; });
      
      return { ...prev, sections };
    });
  };

  const updateBookingCardSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      bookingCard: { ...prev.bookingCard, [key]: value }
    }));
  };

  const updateDisplaySetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      displaySettings: { ...prev.displaySettings, [key]: value }
    }));
  };

  const updateCTASetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      cta: { ...prev.cta, [key]: value }
    }));
  };

  const updateDefaultTemplate = (category, index, value) => {
    setSettings(prev => {
      const newTemplates = { ...prev.defaultTemplates };
      if (Array.isArray(newTemplates[category])) {
        newTemplates[category] = [...newTemplates[category]];
        newTemplates[category][index] = value;
      } else {
        newTemplates[category] = value;
      }
      return { ...prev, defaultTemplates: newTemplates };
    });
  };

  const addDefaultTemplateItem = (category) => {
    setSettings(prev => {
      const newTemplates = { ...prev.defaultTemplates };
      if (Array.isArray(newTemplates[category])) {
        newTemplates[category] = [...newTemplates[category], ''];
      }
      return { ...prev, defaultTemplates: newTemplates };
    });
  };

  const removeDefaultTemplateItem = (category, index) => {
    setSettings(prev => {
      const newTemplates = { ...prev.defaultTemplates };
      if (Array.isArray(newTemplates[category])) {
        newTemplates[category] = newTemplates[category].filter((_, i) => i !== index);
      }
      return { ...prev, defaultTemplates: newTemplates };
    });
  };

  const addBookingDate = () => {
    setSettings(prev => ({
      ...prev,
      bookingCard: {
        ...prev.bookingCard,
        defaultDates: [...(prev.bookingCard.defaultDates || []), '']
      }
    }));
  };

  const updateBookingDate = (index, value) => {
    setSettings(prev => ({
      ...prev,
      bookingCard: {
        ...prev.bookingCard,
        defaultDates: (prev.bookingCard.defaultDates || []).map((date, i) => i === index ? value : date)
      }
    }));
  };

  const removeBookingDate = (index) => {
    setSettings(prev => ({
      ...prev,
      bookingCard: {
        ...prev.bookingCard,
        defaultDates: (prev.bookingCard.defaultDates || []).filter((_, i) => i !== index)
      }
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Product Page Settings
            </h1>
            <p className="text-sm sm:text-base text-gray-600">Manage ProductPage components, sections, and default templates</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                Save Settings
              </>
            )}
          </button>
        </div>

        <div className="space-y-4">
          {/* Tabs Configuration */}
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleSection('tabs')}
              className="w-full p-6 border-b border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-bold text-gray-900">Tabs Configuration</h2>
              </div>
              {expandedSections.tabs ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {expandedSections.tabs && (
              <div className="p-6 space-y-3">
                {settings.tabs.map((tab, index) => (
                  <div key={tab.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{tab.label}</div>
                      <div className="text-xs text-gray-500">Order: {tab.order}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateTabOrder(tab.id, 'up')}
                        disabled={index === 0}
                        className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => updateTabOrder(tab.id, 'down')}
                        disabled={index === settings.tabs.length - 1}
                        className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleTab(tab.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          tab.enabled
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                        title={tab.enabled ? 'Disable' : 'Enable'}
                      >
                        {tab.enabled ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sections Configuration */}
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleSection('sections')}
              className="w-full p-6 border-b border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-bold text-gray-900">Sections Configuration</h2>
              </div>
              {expandedSections.sections ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {expandedSections.sections && (
              <div className="p-6 space-y-3">
                {settings.sections.map((section, index) => (
                  <div key={section.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{section.label}</div>
                      <div className="text-xs text-gray-500">Order: {section.order}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateSectionOrder(section.id, 'up')}
                        disabled={index === 0}
                        className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => updateSectionOrder(section.id, 'down')}
                        disabled={index === settings.sections.length - 1}
                        className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleSectionVisibility(section.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          section.enabled
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                        title={section.enabled ? 'Disable' : 'Enable'}
                      >
                        {section.enabled ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Booking Card Settings */}
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleSection('booking')}
              className="w-full p-6 border-b border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-bold text-gray-900">Booking Sidebar Card Settings</h2>
              </div>
              {expandedSections.booking ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {expandedSections.booking && (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-900">Enable Booking Card</div>
                    <div className="text-sm text-gray-600">Show/hide the entire booking sidebar</div>
                  </div>
                  <button
                    onClick={() => updateBookingCardSetting('enabled', !settings.bookingCard.enabled)}
                    className={`p-2 rounded-lg transition-colors ${
                      settings.bookingCard.enabled
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {settings.bookingCard.enabled ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>

                {settings.bookingCard.enabled && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { key: 'showPrice', label: 'Show Price' },
                        { key: 'showDates', label: 'Show Dates' },
                        { key: 'showTravelers', label: 'Show Travelers' },
                        { key: 'showEnquiryButton', label: 'Show Enquiry Button' },
                        { key: 'showWhatsApp', label: 'Show WhatsApp' },
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-900">{label}</span>
                          <button
                            onClick={() => updateBookingCardSetting(key, !settings.bookingCard[key])}
                            className={`p-2 rounded-lg transition-colors ${
                              settings.bookingCard[key] ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            {settings.bookingCard[key] ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp Number</label>
                        <input
                          type="text"
                          value={settings.bookingCard.whatsappNumber || ''}
                          onChange={(e) => updateBookingCardSetting('whatsappNumber', e.target.value)}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          placeholder="+918448801998"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Min Travelers</label>
                        <input
                          type="number"
                          value={settings.bookingCard.minTravelers || 1}
                          onChange={(e) => updateBookingCardSetting('minTravelers', parseInt(e.target.value))}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Max Travelers</label>
                        <input
                          type="number"
                          value={settings.bookingCard.maxTravelers || 20}
                          onChange={(e) => updateBookingCardSetting('maxTravelers', parseInt(e.target.value))}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          min="1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Default Dates</label>
                      <div className="space-y-2">
                        {(settings.bookingCard.defaultDates || []).map((date, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={date}
                              onChange={(e) => updateBookingDate(index, e.target.value)}
                              className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                              placeholder="Dec 13, 2025"
                            />
                            <button
                              onClick={() => removeBookingDate(index)}
                              className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={addBookingDate}
                          className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Date
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Display Settings */}
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleSection('display')}
              className="w-full p-6 border-b border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-bold text-gray-900">Display Settings</h2>
              </div>
              {expandedSections.display ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {expandedSections.display && (
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Default Tab</label>
                  <select
                    value={settings.displaySettings.defaultTab || 'Itinerary'}
                    onChange={(e) => updateDisplaySetting('defaultTab', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    {settings.tabs.filter(t => t.enabled).map(tab => (
                      <option key={tab.id} value={tab.label}>{tab.label}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Auto Expand Itinerary</div>
                      <div className="text-sm text-gray-600">Show all days expanded by default</div>
                    </div>
                    <button
                      onClick={() => updateDisplaySetting('autoExpandItinerary', !settings.displaySettings.autoExpandItinerary)}
                      className={`p-2 rounded-lg transition-colors ${
                        settings.displaySettings.autoExpandItinerary ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {settings.displaySettings.autoExpandItinerary ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Show Old Price</div>
                      <div className="text-sm text-gray-600">Display strikethrough price</div>
                    </div>
                    <button
                      onClick={() => updateDisplaySetting('showOldPrice', !settings.displaySettings.showOldPrice)}
                      className={`p-2 rounded-lg transition-colors ${
                        settings.displaySettings.showOldPrice ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {settings.displaySettings.showOldPrice ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Show Discount Badge</div>
                      <div className="text-sm text-gray-600">Display discount indicator</div>
                    </div>
                    <button
                      onClick={() => updateDisplaySetting('showDiscountBadge', !settings.displaySettings.showDiscountBadge)}
                      className={`p-2 rounded-lg transition-colors ${
                        settings.displaySettings.showDiscountBadge ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {settings.displaySettings.showDiscountBadge ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Gallery Columns</label>
                    <select
                      value={settings.displaySettings.galleryColumns || 4}
                      onChange={(e) => updateDisplaySetting('galleryColumns', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value={2}>2 Columns</option>
                      <option value={3}>3 Columns</option>
                      <option value={4}>4 Columns</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Max Reviews to Display</label>
                    <input
                      type="number"
                      value={settings.displaySettings.maxReviewsDisplay || 10}
                      onChange={(e) => updateDisplaySetting('maxReviewsDisplay', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      min="1"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CTA Settings */}
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleSection('cta')}
              className="w-full p-6 border-b border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-bold text-gray-900">Call to Action Card Settings</h2>
              </div>
              {expandedSections.cta ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {expandedSections.cta && (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-900">Enable CTA Card</div>
                    <div className="text-sm text-gray-600">Show/hide the call to action section</div>
                  </div>
                  <button
                    onClick={() => updateCTASetting('enabled', !settings.cta.enabled)}
                    className={`p-2 rounded-lg transition-colors ${
                      settings.cta.enabled
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {settings.cta.enabled ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
                {settings.cta.enabled && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">CTA Heading</label>
                      <input
                        type="text"
                        value={settings.cta.heading || ''}
                        onChange={(e) => updateCTASetting('heading', e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Ready to Embark on This Adventure?"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">CTA Description</label>
                      <textarea
                        value={settings.cta.description || ''}
                        onChange={(e) => updateCTASetting('description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Book your spot now and create memories that last a lifetime!"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Button Text</label>
                      <input
                        type="text"
                        value={settings.cta.buttonText || ''}
                        onChange={(e) => updateCTASetting('buttonText', e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Book Now"
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Default Templates */}
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleSection('templates')}
              className="w-full p-6 border-b border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-bold text-gray-900">Default Content Templates</h2>
              </div>
              {expandedSections.templates ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {expandedSections.templates && (
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Default Introduction</label>
                  <textarea
                    value={settings.defaultTemplates.intro || ''}
                    onChange={(e) => updateDefaultTemplate('intro', 0, e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                {['whyVisit', 'included', 'notIncluded', 'notes'].map((category) => (
                  <div key={category}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                      Default {category.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <div className="space-y-2">
                      {(settings.defaultTemplates[category] || []).map((item, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => updateDefaultTemplate(category, index, e.target.value)}
                            className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          />
                          <button
                            onClick={() => removeDefaultTemplateItem(category, index)}
                            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addDefaultTemplateItem(category)}
                        className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Item
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductPageSettings;
