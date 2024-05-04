import { Quota, Permission } from './types'
import { HttpClient } from './http'
import { Cache } from "../utils/cache";

const QUOTA_CACHE_KEY = (userId: string) => `quotas-${userId}`
const PERMISSION_CACHE_KEY = (userId: string) => `permissions-${userId}`

export class AccessControl {
  private permissionsCache: Cache<Permission[]>
  private quotasCache: Cache<Quota[]>

  constructor(
    private readonly http: HttpClient,
    private readonly getUserId: () => Promise<string>
  ) {
    this.permissionsCache = new Cache({
      defaultTtl: 20 // 20 seconds
    })
    this.quotasCache = new Cache({
      defaultTtl: 20 // 20 seconds
    })
  }

  private async quotaCacheKey() {
    const userId = await this.getUserId();
    return QUOTA_CACHE_KEY(userId);
  }

  private async permissionCacheKey() {
    const userId = await this.getUserId();
    return PERMISSION_CACHE_KEY(userId);
  }

  private async getCachedPermissions() {
    const key = await this.permissionCacheKey();
    return this.permissionsCache.get(key);
  }

  private async getCachedQuotas() {
    const key = await this.quotaCacheKey();
    return this.quotasCache.get(key);
  }

  private async cachePermissions(permissions: Permission[]) {
    const key = await this.permissionCacheKey();
    this.permissionsCache.set(key, permissions);
  }

  private async cacheQuotas(quotas: Quota[]) {
      const key = await this.quotaCacheKey();
      this.quotasCache.set(key, quotas);
  }

  private async fetchPermissions() {
	const { permissions } = await this.http.getJson('/permissions/list');

	await this.cachePermissions(permissions);

	return permissions;
  }

  private async fetchQuotas() {
	  const { quotas } = await this.http.getJson('/quotas/list');

	  await this.cacheQuotas(quotas);

	  return quotas;
  }

  /**
   * Retrieves the list of permissions for the logged-in user based on the product attached to them.
   *
   * @param {object} options (optional) - The options for the request.
   * @param {boolean} options.noCache - If true, the method will fetch the permissions from the server instead of using the cache.
   * @returns {Promise Permission[]>} A promise that resolves to an array of Permission objects, each representing a permission for the user.
   */
  public async listPermissions(options?: { noCache?: boolean }): Promise<Permission[]> {
    const cached = await this.getCachedPermissions();
    if (cached?.length && !options?.noCache) {
        return Promise.resolve(cached);
    }

    return this.fetchPermissions()
  }

  /**
   * Retrieves the list of quota usages for the logged-in user based on the product attached to them.
   *
   * @param {object} options (optional) - The options for the request.
   * @param {boolean} options.noCache - If true, the method will fetch the quotas from the server instead of using the cache.
   * @returns {Promise Quota[]>} A promise that resolves to an array of QuotaUsage objects, each representing a quota for the user.
   */
  public async listQuotas(options?: { noCache?: boolean }): Promise<Quota[]> {
    const cached = await this.getCachedQuotas();

    if (cached?.length && !options?.noCache) {
        return Promise.resolve(cached);
    }

    return this.fetchQuotas()
  }

  /**
   * Checks if the user has the specified permission(s).
   *
   * @param {string[]} permissionNames - The names of the permissions to check. Can be a single name or an array of names.
   * @returns {Promise<boolean>} A promise that resolves to true if the user has all permissions, false otherwise.
   */
  public async hasPermission(permissionNames: string[] | string): Promise<boolean> {
    const permissions = await this.listPermissions()

    const names = Array.isArray(permissionNames) ? permissionNames : [permissionNames]

    return names.every((permissionName) => {
      const permission = permissions.find((p) => p.name === permissionName)

      return !!permission
    })
  }

  /**
   * Checks if the user has remaining usage for all specified quota(s).
   *
   * @param {string[]} quotaNames - The names of the quotas to check. Can be a single name or an array of names.
   * @returns {Promise<boolean>} A promise that resolves to true if the user has remaining credit for all quotas, false otherwise.
   */
  public async hasRemainingQuota(quotaNames: string | string[]): Promise<boolean> {
    const quotas = await this.listQuotas()

    const names = Array.isArray(quotaNames) ? quotaNames : [quotaNames]

    return names.every((quotaName) => {
      const quota = quotas.find((q) => q.name === quotaName)

      return (quota?.remaining ?? 0) > 0
    })
  }
}

