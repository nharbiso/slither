package edu.brown.cs32.user;

import java.util.Objects;
import java.util.UUID;

public class User {

  private String id;
  private String username;

  public User(String username) {
    this.id = UUID.randomUUID().toString();
    this.username = username;
  }

  public String getId() {
    return this.id;
  }

  public String getUsername() {
    return this.username;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || this.getClass() != o.getClass()) {
      return false;
    }
    User user = (User) o;
    return this.id.equals(user.id) && this.username.equals(user.username);
  }

  @Override
  public int hashCode() {
    return Objects.hash(this.id, this.username);
  }
}
