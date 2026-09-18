// Local Storage Persistent Player Profile & Match Statistics

const STORAGE_KEY = 'indogame_player_profile';

const DEFAULT_PROFILE = {
  email: 'pemain@indogame.id',
  username: 'KsatriaArcade',
  isLoggedIn: false,
  stats: {
    matches: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    highestCombo: 0,
    favoriteCharacter: 'gufron'
  },
  history: []
};

export const StorageService = {
  getProfile() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? { ...DEFAULT_PROFILE, ...JSON.parse(data) } : DEFAULT_PROFILE;
    } catch (e) {
      return DEFAULT_PROFILE;
    }
  },

  saveProfile(profile) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  },

  login(email, username) {
    const profile = this.getProfile();
    profile.email = email;
    profile.username = username || email.split('@')[0];
    profile.isLoggedIn = true;
    this.saveProfile(profile);
    return profile;
  },

  recordMatchResult(isWin, characterUsed, opponentChar, combo = 0) {
    const profile = this.getProfile();
    profile.stats.matches += 1;
    if (isWin) {
      profile.stats.wins += 1;
    } else {
      profile.stats.losses += 1;
    }
    profile.stats.winRate = Math.round((profile.stats.wins / profile.stats.matches) * 100);
    profile.stats.highestCombo = Math.max(profile.stats.highestCombo, combo);
    profile.stats.favoriteCharacter = characterUsed;

    profile.history.unshift({
      date: new Date().toISOString(),
      isWin,
      characterUsed,
      opponentChar
    });

    if (profile.history.length > 20) {
      profile.history.pop();
    }

    this.saveProfile(profile);
    return profile;
  }
};
