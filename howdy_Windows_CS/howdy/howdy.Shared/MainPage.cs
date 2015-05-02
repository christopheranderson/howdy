using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.MobileServices;
using Windows.UI.Popups;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Navigation;
using howdy.DataModel;
using System.Linq;
using Windows.Security.Credentials;
using howdy;

// To add offline sync support, add the NuGet package Microsoft.WindowsAzure.MobileServices.SQLiteStore
// to your project. Then, uncomment the lines marked // offline sync
// For more information, see: http://aka.ms/addofflinesync
//using Microsoft.WindowsAzure.MobileServices.SQLiteStore;  // offline sync
//using Microsoft.WindowsAzure.MobileServices.Sync;         // offline sync

namespace howdy
{
    sealed partial class MainPage: Page
    {
        private MobileServiceCollection<User, User> users;
        private IMobileServiceTable<User> usersTable = App.MobileService.GetTable<User>();
        private IMobileServiceTable<Howdy> howdyTable = App.MobileService.GetTable<Howdy>();
        //private IMobileServiceSyncTable<TodoItem> todoTable = App.MobileService.GetSyncTable<TodoItem>(); // offline sync

        private User curr;

        public MainPage()
        {
            this.InitializeComponent();
        }

        private async Task InsertUser(User user)
        {
            // This code inserts a new User into the database. When the operation completes
            // and Mobile Services has assigned an Id, the item is added to the CollectionView
            await usersTable.InsertAsync(user);
            users.Add(user);

            //await SyncAsync(); // offline sync
        }

        private async Task RegisterUser()
        {
            User user = new User { Id = this.user.UserId };
            if (users == null || curr != null) { return; }
            try
            {
                curr = await usersTable.LookupAsync(user.Id);
            }
            catch (Exception)
            {
                //User does not exist
            } 
            if (curr != null) { return; }
            try
            {
                await usersTable.InsertAsync(user);
            }
            catch (Exception)
            {
                //
            }
            curr = await usersTable.LookupAsync(this.user.UserId);   
        }

        private async Task RefreshUsers()
        {
            MobileServiceInvalidOperationException exception = null;
            try
            {
                // This code refreshes the entries in the list view by querying the Users table.
                // The query excludes completed Users
                users = await usersTable
                    .ToCollectionAsync();
            }
            catch (MobileServiceInvalidOperationException e)
            {
                exception = e;
            }

            if (exception != null)
            {
                await new MessageDialog(exception.Message, "Error loading items").ShowAsync();
            }
            else
            {
                ListItems.ItemsSource = users;
            }
        }

        private async Task UpdateCheckedTodoItem(User user)
        {
            // This code takes a freshly completed TodoItem and updates the database. When the MobileService 
            // responds, the item is removed from the list 
            await usersTable.UpdateAsync(user);
            users.Remove(user);
            ListItems.Focus(Windows.UI.Xaml.FocusState.Unfocused);

            //await SyncAsync(); // offline sync
        }

        private async void ButtonRefresh_Click(object sender, RoutedEventArgs e)
        {
            //ButtonRefresh.IsEnabled = false;

            //await SyncAsync(); // offline sync
            await RefreshUsers();

            //ButtonRefresh.IsEnabled = true;
        }

        private async void CheckBoxComplete_Checked(object sender, RoutedEventArgs e)
        {
            CheckBox cb = (CheckBox)sender;
            //TodoItem item = cb.DataContext as TodoItem;
            //await UpdateCheckedTodoItem(item);
        }

        private async void HowdyButton_Click(object sender, Windows.UI.Xaml.RoutedEventArgs e)
        {
            ((Button)sender).IsEnabled = false;
            if (curr == null)
            {
                curr = await usersTable.LookupAsync(user.UserId);
            }
            Howdy send = new Howdy{ From = curr.Name, To = (((Button)sender).DataContext as User).Id};
            await howdyTable.InsertAsync(send);
            ((Button)sender).IsEnabled = true;
        }

        // Define a member variable for storing the signed-in user. 
        private MobileServiceUser user;

        private async System.Threading.Tasks.Task AuthenticateAsync(bool isNavigate = false)
        {
            string message;
            // This sample uses the Facebook provider.
            var provider = "Facebook";

            // Use the PasswordVault to securely store and access credentials.
            PasswordVault vault = new PasswordVault();
            PasswordCredential credential = null;

            while (credential == null)
            {
                try
                {
                    // Try to get an existing credential from the vault.
                    credential = vault.FindAllByResource(provider).FirstOrDefault();
                }
                catch (Exception)
                {
                    // When there is no matching resource an error occurs, which we ignore.
                }


                if (credential != null)
                {
                    // Create a user from the stored credentials.
                    user = new MobileServiceUser(credential.UserName);
                    credential.RetrievePassword();
                    user.MobileServiceAuthenticationToken = credential.Password;

                    // Set the user from the stored credentials.
                    App.MobileService.CurrentUser = user;

                    try
                    {
                        // Try to return an item now to determine if the cached credential has expired.
                        await App.MobileService.GetTable<User>().Take(1).ToListAsync();
                    }
                    catch (MobileServiceInvalidOperationException ex)
                    {
                        if (ex.Response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                        {
                            // Remove the credential with the expired token.
                            vault.Remove(credential);
                            credential = null;
                            continue;
                        }
                    }
                }
                else
                {
                    if (isNavigate)
                    {
                        return;
                    }

                    try
                    {
                        // Login with the identity provider.
                        user = await App.MobileService
                            .LoginAsync(provider);

                        // Create and store the user credentials.
                        credential = new PasswordCredential(provider,
                            user.UserId, user.MobileServiceAuthenticationToken);
                        vault.Add(credential);
                    }
                    catch (MobileServiceInvalidOperationException ex)
                    {
                        message = "You must log in. Login Required";
                    }
                }
                this.hideButtonLogin();
                howdy.howdyPush.UploadChannel();
                await RefreshUsers();
            }
        }

        partial void hideButtonLogin();

        #region Offline sync

        //private async Task InitLocalStoreAsync()
        //{
        //    if (!App.MobileService.SyncContext.IsInitialized)
        //    {
        //        var store = new MobileServiceSQLiteStore("localstore.db");
        //        store.DefineTable<TodoItem>();
        //        await App.MobileService.SyncContext.InitializeAsync(store);
        //    }
        //
        //    await SyncAsync();
        //}

        //private async Task SyncAsync()
        //{
        //    await App.MobileService.SyncContext.PushAsync();
        //    await todoTable.PullAsync("todoItems", todoTable.CreateQuery());
        //}

        #endregion 
    }


}
