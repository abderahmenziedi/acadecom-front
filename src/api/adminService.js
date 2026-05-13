/**
 * adminService.js - Service pour la gestion des utilisateurs et resources admin
 * Centralise tous les appels API admin pour éviter la logique métier dans les composants
 */
import api from './axios';

const adminService = {
  /**
   * Récupérer tous les utilisateurs avec filtrage et pagination
   */
  async getUsers(params = {}) {
    const { role, page = 1, limit = 10, ...rest } = params;
    const query = new URLSearchParams({ page, limit, ...rest });
    if (role) query.append('role', role);
    
    const response = await api.get(`/v1/admin/users?${query}`);
    return response.data;
  },

  /**
   * Bloquer un utilisateur
   */
  async blockUser(userId) {
    const response = await api.patch(`/v1/admin/users/${userId}/block`);
    return response.data;
  },

  /**
   * Débloquer un utilisateur
   */
  async unblockUser(userId) {
    const response = await api.patch(`/v1/admin/users/${userId}/unblock`);
    return response.data;
  },

  /**
   * Supprimer un utilisateur
   */
  async deleteUser(userId) {
    const response = await api.delete(`/v1/admin/users/${userId}`);
    return response.data;
  },

  /**
   * Exporter les utilisateurs en CSV
   */
  async exportUsersCsv() {
    const response = await api.get('/v1/admin/users/export/csv', {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Récupérer toutes les brands
   */
  async getBrands(params = {}) {
    const { page = 1, limit = 10 } = params;
    const response = await api.get(`/v1/admin/brands?page=${page}&limit=${limit}`);
    return response.data;
  },

  /**
   * Créer une brand
   */
  async createBrand(data) {
    const response = await api.post('/v1/admin/brands', data);
    return response.data;
  },

  /**
   * Mettre à jour une brand
   */
  async updateBrand(brandId, data) {
    const response = await api.put(`/v1/admin/brands/${brandId}`, data);
    return response.data;
  },

  /**
   * Supprimer une brand
   */
  async deleteBrand(brandId) {
    const response = await api.delete(`/v1/admin/brands/${brandId}`);
    return response.data;
  },

  /**
   * Récupérer tous les quizmasters
   */
  async getQuizmasters(params = {}) {
    const { page = 1, limit = 10 } = params;
    const response = await api.get(`/v1/admin/quizmasters?page=${page}&limit=${limit}`);
    return response.data;
  },

  /**
   * Créer un quizmaster
   */
  async createQuizmaster(data) {
    const response = await api.post('/v1/admin/quizmasters', data);
    return response.data;
  },

  /**
   * Mettre à jour un quizmaster
   */
  async updateQuizmaster(quizmasterId, data) {
    const response = await api.put(`/v1/admin/quizmasters/${quizmasterId}`, data);
    return response.data;
  },

  /**
   * Supprimer un quizmaster
   */
  async deleteQuizmaster(quizmasterId) {
    const response = await api.delete(`/v1/admin/quizmasters/${quizmasterId}`);
    return response.data;
  },
};

export default adminService;
