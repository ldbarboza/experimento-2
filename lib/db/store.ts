import { Person } from '../types';

/**
 * In-memory data store for people records
 * Uses singleton pattern to ensure single source of truth
 * Data is ephemeral and lost on server restart/deployment
 */
class PeopleStore {
  private static instance: PeopleStore;
  private people: Map<string, Person> = new Map();

  private constructor() {
    // Initialize with empty store
  }

  /**
   * Get singleton instance
   */
  static getInstance(): PeopleStore {
    if (!PeopleStore.instance) {
      PeopleStore.instance = new PeopleStore();
    }
    return PeopleStore.instance;
  }

  /**
   * Create a new person record
   */
  create(person: Person): Person {
    this.people.set(person.id, person);
    return person;
  }

  /**
   * Get a person by ID
   */
  getById(id: string): Person | undefined {
    return this.people.get(id);
  }

  /**
   * Get all people
   */
  getAll(): Person[] {
    return Array.from(this.people.values());
  }

  /**
   * Update a person record
   */
  update(id: string, updates: Partial<Person>): Person | undefined {
    const person = this.people.get(id);
    if (!person) {
      return undefined;
    }

    const updated = {
      ...person,
      ...updates,
      id: person.id,
      createdAt: person.createdAt,
      updatedAt: new Date().toISOString(),
    };

    this.people.set(id, updated);
    return updated;
  }

  /**
   * Delete a person record
   */
  delete(id: string): boolean {
    return this.people.delete(id);
  }

  /**
   * Check if email exists (excluding a specific ID for updates)
   */
  emailExists(email: string, excludeId?: string): boolean {
    for (const person of this.people.values()) {
      if (person.email === email && person.id !== excludeId) {
        return true;
      }
    }
    return false;
  }

  /**
   * Search people by name or email
   */
  search(query: string): Person[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.people.values()).filter(
      (person) =>
        person.name.toLowerCase().includes(lowerQuery) ||
        person.email.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get total count of people
   */
  count(): number {
    return this.people.size;
  }

  /**
   * Clear all data (useful for testing)
   */
  clear(): void {
    this.people.clear();
  }
}

export const store = PeopleStore.getInstance();
